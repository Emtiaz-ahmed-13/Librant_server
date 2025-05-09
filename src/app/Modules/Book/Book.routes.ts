import { Router } from "express";
import { BookController } from "./Book.controller";

const router = Router();

router.post("/create-new-book", BookController.CreateBook);
router.get("/get-all-books", BookController.RetriveBooks);
router.get("/get-book/:id", BookController.RetriveSingleBook);
router.get("/category", BookController.NumberOfCategory);
router.get("/authors", BookController.GetAuthors);
router.patch("/delete-book/:id", BookController.DeleteBook);
router.put("/update-book/:id", BookController.UpdateBook);
router.get("/featured", BookController.GetFeaturedBooks);
router.get("/new-arrivals", BookController.GetNewArrivals);
router.get("/categories", BookController.GetAllCategories);
router.get("/category/:category", BookController.GetBooksByCategory);
export const BookRoutes = router;
