import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, l as money } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { T as Plus, ft as ArrowDownToLine, p as ShoppingCart, u as TriangleAlert, ut as ArrowUpFromLine, x as RotateCcw, y as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CycotAhG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.inventory-1FvNPELt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	name: "",
	category: "General",
	description: "",
	unit: "pcs",
	quantity: "",
	minimum_stock: "",
	unit_cost: "",
	supplier: "",
	purchase_date: "",
	location: "",
	condition: "Good",
	is_for_sale: false,
	sale_price: "",
	size_required: false,
	available_sizes: ""
};
function InventoryPage() {
	const { userId, hasRole } = useMe();
	const leadership = hasRole("admin") || hasRole("headteacher");
	const teacher = hasRole("teacher") && !leadership;
	const qc = useQueryClient();
	const [form, setForm] = import_react.useState(empty);
	const [search, setSearch] = import_react.useState("");
	const [dialog, setDialog] = import_react.useState(null);
	const [tx, setTx] = import_react.useState({
		quantity: "",
		recipient_id: "",
		student_id: "",
		department: "",
		reference: "",
		notes: "",
		condition_on_return: "Good"
	});
	const [shopStudent, setShopStudent] = import_react.useState("");
	const [shopQty, setShopQty] = import_react.useState({});
	const [shopSize, setShopSize] = import_react.useState({});
	const items = useQuery({
		queryKey: ["inventory-items"],
		queryFn: async () => {
			const { data, error } = await supabase.from("inventory_items").select("*").eq("is_active", true).order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const staff = useQuery({
		queryKey: ["inventory-staff"],
		enabled: leadership,
		queryFn: async () => {
			const { data: roles, error: re } = await supabase.from("user_roles").select("user_id,role").eq("role", "teacher");
			if (re) throw re;
			const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
			if (!ids.length) return [];
			const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids);
			if (error) throw error;
			return data ?? [];
		}
	});
	const students = useQuery({
		queryKey: ["inventory-students"],
		enabled: leadership,
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").eq("status", "active").order("first_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	useQuery({
		queryKey: ["shop-my-children", userId],
		enabled: hasRole("parent") && Boolean(userId),
		queryFn: async () => {
			const { data, error } = await supabase.from("parent_student").select("student_id,students(id,first_name,last_name,admission_no)").eq("parent_id", userId);
			if (error) throw error;
			return (data ?? []).map((r) => r.students).filter(Boolean);
		}
	});
	const history = useQuery({
		queryKey: [
			"inventory-history",
			userId,
			leadership
		],
		queryFn: async () => {
			let q = supabase.from("inventory_transactions").select("*,inventory_items:item_id(name)").order("created_at", { ascending: false }).limit(100);
			if (teacher) q = q.eq("recipient_id", userId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	const shopOrders = useQuery({
		queryKey: ["shop-orders", leadership],
		enabled: leadership,
		queryFn: async () => {
			const { data, error } = await supabase.from("store_orders").select("id,parent_id,student_id,status,payment_status,total_amount,created_at,store_order_items(quantity,size,unit_price,inventory_items:item_id(name))").order("created_at", { ascending: false }).limit(50);
			if (error) throw error;
			return data ?? [];
		}
	});
	const addItem = useMutation({
		mutationFn: async () => {
			if (!form.name.trim()) throw new Error("Item name is required.");
			const { error } = await supabase.from("inventory_items").insert({
				...form,
				condition: form.condition.toLowerCase(),
				available_sizes: form.available_sizes.split(",").map((x) => x.trim()).filter(Boolean),
				quantity: Number(form.quantity || 0),
				minimum_stock: Number(form.minimum_stock || 0),
				unit_cost: Number(form.unit_cost || 0),
				purchase_date: form.purchase_date || null,
				created_by: userId
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Item added successfully.");
			setForm(empty);
			qc.invalidateQueries({ queryKey: ["inventory-items"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add item")
	});
	const transaction = useMutation({
		mutationFn: async () => {
			if (!dialog) return;
			const qty = Number(tx.quantity);
			if (!qty || qty <= 0) throw new Error("Enter a valid quantity.");
			const { error } = await supabase.rpc("record_inventory_transaction", {
				_item_id: dialog.item.id,
				_transaction_type: dialog.type,
				_quantity: qty,
				_recipient_id: tx.recipient_id || null,
				_student_id: tx.student_id || null,
				_department: tx.department || null,
				_reference: tx.reference || null,
				_notes: tx.notes || null,
				_condition_on_return: dialog.type === "return" ? tx.condition_on_return : null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Inventory transaction recorded.");
			setDialog(null);
			setTx({
				quantity: "",
				recipient_id: "",
				student_id: "",
				department: "",
				reference: "",
				notes: "",
				condition_on_return: "Good"
			});
			qc.invalidateQueries({ queryKey: ["inventory-items"] });
			qc.invalidateQueries({ queryKey: ["inventory-history"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Transaction failed")
	});
	useMutation({
		mutationFn: async (item) => {
			if (!shopStudent) throw new Error("Select the child this order is for.");
			const qty = Number(shopQty[item.id] || 0);
			if (!qty) throw new Error("Enter a quantity.");
			const { error } = await supabase.rpc("place_store_order", {
				_student_id: shopStudent,
				_item_id: item.id,
				_quantity: qty,
				_size: item.size_required ? shopSize[item.id] || null : null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("School shop order placed successfully.");
			setShopQty({});
			setShopSize({});
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not place order")
	});
	const visible = (items.data ?? []).filter((i) => `${i.name} ${i.category} ${i.supplier ?? ""} ${i.location ?? ""}`.toLowerCase().includes(search.toLowerCase()));
	const low = (items.data ?? []).filter((i) => Number(i.quantity) <= Number(i.minimum_stock));
	const totalUnits = (items.data ?? []).reduce((n, i) => n + Number(i.quantity || 0), 0);
	if (!leadership && hasRole("parent")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentInventory, { items: items.data ?? [] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Inventory Management",
			description: "Track school stock, issue items, record returns and monitor low-stock levels."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					title: "Items",
					value: String(items.data?.length ?? 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					title: "Units in stock",
					value: String(totalUnits)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					title: "Low stock",
					value: String(low.length),
					warning: low.length > 0
				})
			]
		}),
		leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add inventory item"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Item name",
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Category",
							value: form.category,
							onChange: (e) => setForm({
								...form,
								category: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Unit e.g. pcs",
							value: form.unit,
							onChange: (e) => setForm({
								...form,
								unit: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							placeholder: "Opening quantity",
							value: form.quantity,
							onChange: (e) => setForm({
								...form,
								quantity: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							placeholder: "Minimum stock",
							value: form.minimum_stock,
							onChange: (e) => setForm({
								...form,
								minimum_stock: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							placeholder: "Unit cost (KSh)",
							value: form.unit_cost,
							onChange: (e) => setForm({
								...form,
								unit_cost: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Supplier",
							value: form.supplier,
							onChange: (e) => setForm({
								...form,
								supplier: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							placeholder: "Sale price (KSh)",
							value: form.sale_price,
							onChange: (e) => setForm({
								...form,
								sale_price: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Storage location",
							value: form.location,
							onChange: (e) => setForm({
								...form,
								location: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.purchase_date,
							onChange: (e) => setForm({
								...form,
								purchase_date: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_for_sale,
								onChange: (e) => setForm({
									...form,
									is_for_sale: e.target.checked
								})
							}), "Sell in School Shop"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.size_required,
								onChange: (e) => setForm({
									...form,
									size_required: e.target.checked
								})
							}), "Size required"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 rounded-md border bg-background px-3 text-sm",
							value: form.condition,
							onChange: (e) => setForm({
								...form,
								condition: e.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "New" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Good" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Fair" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Damaged" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Lost" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Available sizes, comma separated (e.g. 28, 30, 32, S, M, L)",
							value: form.available_sizes,
							onChange: (e) => setForm({
								...form,
								available_sizes: e.target.value
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-3",
					placeholder: "Description",
					value: form.description,
					onChange: (e) => setForm({
						...form,
						description: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					onClick: () => addItem.mutate(),
					disabled: addItem.isPending,
					children: addItem.isPending ? "Saving…" : "Add item"
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search inventory…",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "max-w-md"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: visible.map((item) => {
				const isLow = Number(item.quantity) <= Number(item.minimum_stock);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: item.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							item.category,
							" · ",
							item.location || "No location"
						]
					})] }), isLow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-1 size-3" }), "Low stock"]
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Available: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
								item.quantity,
								" ",
								item.unit
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Minimum: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.minimum_stock })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Cost: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(item.unit_cost) })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Condition: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.condition })] })
						]
					}),
					item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: item.description
					}),
					leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setDialog({
									type: "purchase",
									item
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, { className: "mr-1 size-4" }), "Add stock"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setDialog({
									type: "issue",
									item
								}),
								disabled: !item.quantity,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpFromLine, { className: "mr-1 size-4" }), "Issue"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setDialog({
									type: "return",
									item
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 size-4" }), "Return"]
							})
						]
					})
				] })] }, item.id);
			})
		}),
		!visible.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No inventory items found." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: teacher ? "My issued inventory" : "Inventory transaction history"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: history.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y",
				children: history.data.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-between gap-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: h.inventory_items?.name || "Item" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 capitalize",
							children: h.transaction_type
						}),
						h.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: h.notes
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						h.quantity,
						" · ",
						new Date(h.created_at).toLocaleDateString()
					] })]
				}, h.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No inventory transactions yet." }) })]
		}),
		leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "size-4" }), "School shop orders"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: shopOrders.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y",
				children: shopOrders.data.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["Order #", o.id.slice(0, 8)] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Parent: ",
								o.parent_id.slice(0, 8),
								" · Student: ",
								o.student_id?.slice(0, 8) || "—"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: (o.store_order_items ?? []).map((x) => `${x.inventory_items?.name || "Item"} ×${x.quantity}${x.size ? ` · Size ${x.size}` : ""}`).join(", ")
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(o.total_amount) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs capitalize text-muted-foreground",
							children: [
								o.status,
								" · ",
								o.payment_status
							]
						})]
					})]
				}, o.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No school shop orders yet." }) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!dialog,
			onOpenChange: (open) => !open && setDialog(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				dialog?.type === "issue" ? "Issue stock" : dialog?.type === "return" ? "Record return" : dialog?.type === "purchase" ? "Add stock" : "Adjust stock",
				" · ",
				dialog?.item?.name
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "1",
						placeholder: "Quantity",
						value: tx.quantity,
						onChange: (e) => setTx({
							...tx,
							quantity: e.target.value
						})
					}),
					dialog?.type === "issue" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border bg-background px-3 text-sm",
							value: tx.recipient_id,
							onChange: (e) => setTx({
								...tx,
								recipient_id: e.target.value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select teacher (optional)"
							}), (staff.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: fullName(s)
							}, s.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border bg-background px-3 text-sm",
							value: tx.student_id,
							onChange: (e) => setTx({
								...tx,
								student_id: e.target.value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select student (optional)"
							}), (students.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.id,
								children: [
									fullName(s),
									" · ",
									s.admission_no
								]
							}, s.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Department / class",
							value: tx.department,
							onChange: (e) => setTx({
								...tx,
								department: e.target.value
							})
						})
					] }),
					dialog?.type === "return" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 w-full rounded-md border bg-background px-3 text-sm",
						value: tx.condition_on_return,
						onChange: (e) => setTx({
							...tx,
							condition_on_return: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "New" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Good" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Fair" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Damaged" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Lost" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Reference / voucher no.",
						value: tx.reference,
						onChange: (e) => setTx({
							...tx,
							reference: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						placeholder: "Notes",
						value: tx.notes,
						onChange: (e) => setTx({
							...tx,
							notes: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => transaction.mutate(),
						disabled: transaction.isPending,
						children: transaction.isPending ? "Saving…" : "Save transaction"
					})
				]
			})] })
		})
	] });
}
function ParentInventory({ items }) {
	const { userId } = useMe();
	const orders = useQuery({
		queryKey: ["my-shop-orders", userId],
		enabled: Boolean(userId),
		queryFn: async () => {
			const { data, error } = await supabase.from("store_orders").select("id,status,payment_status,total_amount,created_at,store_order_items(quantity,size,unit_price,inventory_items:item_id(name)").eq("parent_id", userId).order("created_at", { ascending: false }).limit(20);
			if (error) throw error;
			return data ?? [];
		}
	});
	const children = useQuery({
		queryKey: ["shop-children", userId],
		enabled: Boolean(userId),
		queryFn: async () => {
			const { data, error } = await supabase.from("parent_student").select("student_id,students(id,first_name,last_name,admission_no)").eq("parent_id", userId);
			if (error) throw error;
			return (data ?? []).map((r) => r.students).filter(Boolean);
		}
	});
	const [child, setChild] = import_react.useState("");
	const [qty, setQty] = import_react.useState({});
	const [size, setSize] = import_react.useState({});
	const order = useMutation({
		mutationFn: async (item) => {
			if (!child) throw new Error("Select a child.");
			const q = Number(qty[item.id] || 0);
			if (!q) throw new Error("Enter a quantity.");
			const { error } = await supabase.rpc("place_store_order", {
				_student_id: child,
				_item_id: item.id,
				_quantity: q,
				_size: item.size_required ? size[item.id] || null : null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Order placed successfully.");
			setQty({});
			setSize({});
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not place order")
	});
	const saleItems = items.filter((i) => i.is_for_sale);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "School Shop",
			description: "Order uniforms, books and other school items for your child."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Order for"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-10 w-full max-w-md rounded-md border bg-background px-3 text-sm",
				value: child,
				onChange: (e) => setChild(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Select child"
				}), (children.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: c.id,
					children: [
						fullName(c),
						" · ",
						c.admission_no
					]
				}, c.id))]
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "My shop orders"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: orders.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y",
				children: orders.data.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["Order #", o.id.slice(0, 8)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: (o.store_order_items ?? []).map((x) => `${x.inventory_items?.name || "Item"} ×${x.quantity}${x.size ? ` · Size ${x.size}` : ""}`).join(", ")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(o.total_amount) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs capitalize text-muted-foreground",
							children: [
								o.status,
								" · ",
								o.payment_status
							]
						})]
					})]
				}, o.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No orders yet."
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [saleItems.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: i.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: i.category
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: ["Available: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
							i.quantity,
							" ",
							i.unit
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: ["Price: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(i.sale_price) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: i.description || "School item"
					}),
					i.size_required && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Size required"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Enter size (e.g. 32, S, M, XL)",
								value: size[i.id] || "",
								onChange: (e) => setSize({
									...size,
									[i.id]: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Enter the exact size you want for this child."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "1",
						max: i.quantity,
						placeholder: "Quantity",
						value: qty[i.id] || "",
						onChange: (e) => setQty({
							...qty,
							[i.id]: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => order.mutate(i),
						disabled: order.isPending || !i.quantity,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mr-2 size-4" }), "Place order"]
					})
				]
			})] }, i.id)), !saleItems.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No school shop items are currently available." })]
		})
	] });
}
function Stat({ title, value, warning }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-2xl font-bold",
				children: value
			}),
			warning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs font-medium text-destructive",
				children: "Attention required"
			})
		]
	}) });
}
//#endregion
export { InventoryPage as component };
