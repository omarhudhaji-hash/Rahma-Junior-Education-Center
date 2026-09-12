export const logoUrl = "/images/logo.jpg";

export const portalPhotos = [
  "/images/gallery/photo-01.jpg",
  "/images/gallery/photo-02.jpg",
  "/images/gallery/photo-04.jpg",
  "/images/gallery/photo-05.jpg",
];

export const galleryPhotos = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const captions = [
    "A proud moment at Rahma",
    "Focused classroom learning",
    "Graduation and milestones",
    "Building computer skills",
    "Confidence beyond the classroom",
    "Growing together as a community",
    "Support that makes a difference",
    "Community and staff experiences",
    "Teamwork, energy and confidence",
    "The Rahma experience",
  ];
  return { url: `/images/gallery/photo-${number}.jpg`, caption: captions[index] ?? "Rahma school life" };
});

export const heroPhotos = [
  "/images/gallery/photo-01.jpg",
  "/images/gallery/photo-02.jpg",
  "/images/gallery/photo-04.jpg",
  "/images/gallery/photo-05.jpg",
  "/images/gallery/photo-09.jpg",
  "/images/gallery/photo-03.jpg",
  "/images/gallery/photo-10.jpg",
];

export const schoolPhotos = {
  students: "/images/school/students.jpeg",
  studentsInClass: "/images/school/studentsinclass.jpeg",
  classOfStudents: "/images/school/classofstudent.jpeg",
  computerLab: "/images/school/computerlab.jpeg",
  boysGame: "/images/school/boysgame.jpeg",
  girlsGames: "/images/school/girlsgames.jpeg",
  graduation: "/images/school/graduation.jpeg",
  school: "/images/school/theschool.jpeg",
  teacherStrip: "/images/school/teacherstrip.jpeg",
  tripForTeachers: "/images/school/tripforteachers.jpeg",
  directorGraduation: "/images/school/Schooldirctorsermonongraduation.jpeg",
};
