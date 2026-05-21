const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
    const internshipId = req.params.id;
    res.json({
        message: `Details for internship ID: ${internshipId}`,
        id: internshipId,
        title: "Example Internship",
        description: "Details go here..."
    });
});

module.exports = router;