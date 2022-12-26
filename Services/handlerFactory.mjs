import { ApiError } from "../util/apiError.mjs";
import { ApiFeature } from "../util/apiFeature.mjs";

/* eslint-disable import/prefer-default-export */
export const deleteOne = (Model) => async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document found for this ${id}`, 404));
    }
    // triggers 'remove' event
    document.remove();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateOne = (Model) => async (req, res, next) => {
  try {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document found for this ${req.params.id}`, 404)
      );
    }
    // triggers 'save' event
    document.save();
    res
      .status(200)
      .json({ message: "Document updated successfully", data: document });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const createOne = (Model) => async (req, res) => {
  try {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getOne = (Model, populateOptions) => async (req, res, next) => {
  const { id } = req.params;
  try {
    let query = Model.findById(id);
    if (populateOptions) {
      query = Model.findById(id).populate(populateOptions);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document found for this ${id}`, 404));
    }
    res.status(200).json({ data: document });
  } catch (err) {
    // res.status(400).json(err);
    next(err);
  }
};

export const getAll =
  (Model, modelName = "") =>
  async (req, res) => {
    try {
      let filter = {};
      if (req.filterObject) {
        filter = req.filterObject;
      }
      const documentsCount = await Model.countDocuments();
      // Build query
      const apiFeature = new ApiFeature(Model.find(filter), req.query)
        .paginate(documentsCount)
        .sort()
        .search(modelName)
        .selectFields()
        .filter();
      // Execute query
      const { query, paginationResults } = apiFeature;
      const documents = await query;

      res.status(200).json({
        results: documents.length,
        paginationResults,
        data: documents,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  };
