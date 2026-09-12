-- Rahma Edu Hub: professional dashboards + parent school shop ordering

ALTER TABLE public.inventory_items
  ADD COLUMN IF NOT EXISTS is_for_sale boolean NOT NULL DEFAULT false;
ALTER TABLE public.inventory_items
  ADD COLUMN IF NOT EXISTS sale_price numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE public.inventory_items
  ADD COLUMN IF NOT EXISTS size_required boolean NOT NULL DEFAULT false;
ALTER TABLE public.inventory_items
  ADD COLUMN IF NOT EXISTS available_sizes text[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.store_orders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid references public.students(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','confirmed','ready','fulfilled','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','refunded')),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.store_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id) on delete cascade,
  item_id uuid not null references public.inventory_items(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  size text,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_store_orders_parent on public.store_orders(parent_id, created_at desc);
CREATE INDEX IF NOT EXISTS idx_store_orders_status on public.store_orders(status, created_at desc);
CREATE INDEX IF NOT EXISTS idx_store_order_items_order on public.store_order_items(order_id);

ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS store_orders_parent_read ON public.store_orders;
CREATE POLICY store_orders_parent_read ON public.store_orders
FOR SELECT TO authenticated
USING (parent_id = auth.uid());

DROP POLICY IF EXISTS store_orders_parent_insert ON public.store_orders;
CREATE POLICY store_orders_parent_insert ON public.store_orders
FOR INSERT TO authenticated
WITH CHECK (parent_id = auth.uid() AND public.has_role(auth.uid(),'parent'));

DROP POLICY IF EXISTS store_orders_leadership_manage ON public.store_orders;
CREATE POLICY store_orders_leadership_manage ON public.store_orders
FOR ALL TO authenticated
USING (public.is_leadership())
WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS store_order_items_parent_read ON public.store_order_items;
CREATE POLICY store_order_items_parent_read ON public.store_order_items
FOR SELECT TO authenticated
USING (exists (select 1 from public.store_orders o where o.id = order_id and o.parent_id = auth.uid()));

DROP POLICY IF EXISTS store_order_items_parent_insert ON public.store_order_items;
CREATE POLICY store_order_items_parent_insert ON public.store_order_items
FOR INSERT TO authenticated
WITH CHECK (exists (select 1 from public.store_orders o where o.id = order_id and o.parent_id = auth.uid() and public.has_role(auth.uid(),'parent')));

DROP POLICY IF EXISTS store_order_items_leadership_manage ON public.store_order_items;
CREATE POLICY store_order_items_leadership_manage ON public.store_order_items
FOR ALL TO authenticated
USING (public.is_leadership())
WITH CHECK (public.is_leadership());

GRANT SELECT, INSERT, UPDATE ON public.store_orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.store_order_items TO authenticated;

-- Secure order placement: validate products/sizes and calculate totals server-side.
CREATE OR REPLACE FUNCTION public.place_store_order(
  _student_id uuid,
  _item_id uuid,
  _quantity integer,
  _size text DEFAULT NULL,
  _notes text DEFAULT NULL
)
RETURNS public.store_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item public.inventory_items;
  v_order public.store_orders;
  v_price numeric(12,2);
BEGIN
  IF NOT public.has_role(auth.uid(),'parent') THEN
    RAISE EXCEPTION 'Only parent accounts can place school shop orders.';
  END IF;
  IF _quantity IS NULL OR _quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than zero.';
  END IF;
  IF _student_id IS NULL OR NOT public.can_view_student(_student_id) THEN
    RAISE EXCEPTION 'You can only order for your own child.';
  END IF;

  SELECT * INTO v_item
  FROM public.inventory_items
  WHERE id = _item_id AND is_active = true AND is_for_sale = true
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'School shop item is unavailable.'; END IF;
  IF _quantity > v_item.quantity THEN RAISE EXCEPTION 'Only % units are currently available.', v_item.quantity; END IF;
  IF v_item.size_required THEN
    IF coalesce(trim(_size),'') = '' THEN RAISE EXCEPTION 'Please select a size.'; END IF;
    -- Parents enter the exact size they want (for example 28, 32, S, M, XL).
    -- available_sizes is informational for the school and does not restrict the parent's entry.
  END IF;

  v_price := coalesce(v_item.sale_price,0);
  INSERT INTO public.store_orders(parent_id, student_id, total_amount, notes)
  VALUES (auth.uid(), _student_id, v_price * _quantity, _notes)
  RETURNING * INTO v_order;

  INSERT INTO public.store_order_items(order_id,item_id,quantity,unit_price,size,notes)
  VALUES (v_order.id,_item_id,_quantity,v_price,NULLIF(trim(_size),''),_notes);

  RETURN v_order;
END;
$$;
GRANT EXECUTE ON FUNCTION public.place_store_order(uuid,uuid,integer,text,text) TO authenticated;

-- Do not let direct parent inserts bypass the server-side order workflow.
DROP POLICY IF EXISTS store_orders_parent_insert ON public.store_orders;
-- Orders are created through place_store_order().

DROP POLICY IF EXISTS store_order_items_parent_insert ON public.store_order_items;
-- Items are created together with the order by place_store_order().

CREATE OR REPLACE FUNCTION public.touch_store_order_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS trg_store_orders_updated_at ON public.store_orders;
CREATE TRIGGER trg_store_orders_updated_at BEFORE UPDATE ON public.store_orders FOR EACH ROW EXECUTE FUNCTION public.touch_store_order_updated_at();
