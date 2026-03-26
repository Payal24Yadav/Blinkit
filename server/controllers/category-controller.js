import CategoryModel from "../model/category-model.js";
import ProductModel from "../model/product-model.js";
import SubCategoryModel from "../model/subCategory-model.js";

export const AddCategoryController=async (req,res)=>{
    try{

        const{name, image}=req.body;
        if(!name || !image){
            return res.status(400).json({
                message:"All fields are required",
                error:true,
                success:false
            })
        }

        const addCategory= new CategoryModel({
            name,
            image
        })
        const saveCategory = await addCategory.save();
        if(!saveCategory){
            return res.status(500).json({
                message:"Error while saving category",
                error:true,
                success:false
            })
        }
        return res.status(200).json({
            message:"Category added successfully",
            error:false,    
            success:true,
            data:saveCategory
        })
    } catch(error){
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export const getCategoryController=async(req,res)=>{
    try{
        const data = await CategoryModel.find()

        return res.status(200).json({
            message:"Category fetched successfully",
            error:false,
            success:true,
            data:data
        })
    } catch(err){
        return res.status(500).json({
            message:err.message || err,
            error:true,
            success:false
        })
    }
}

export const updateCategoryController = async (req,res)=>{
    try{
        const {_id, name, image}=req.body;

        const update=await CategoryModel.updateOne({
            _id:_id
        },{
            name,
            image
        })
        if(!update){
            return res.status(400).json({
                message:"Error while updating category",
                error:true,
                success:false
            })
        }
        return res.status(200).json({
            message:"Category updated successfully",
            error:false,
            success:true,
            data:update
        })
    } catch(error){
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export const deleteCategoryController = async (req,res)=>{
    try{
        const {_id}=req.body;
        const checkSubCategory = await SubCategoryModel.find({
            category:{
                "$in":[_id]
            }
        }).countDocuments()

         const checkProduct = await ProductModel.find({
            category:{
                "$in":[_id]
            }
        }).countDocuments()

        if(checkSubCategory>0 || checkProduct>0){
            return res.status(400).json({
                message:"Category is already use can't delete", 
                error:true,
                success:false
            })
        }

        const deleteCategory = await CategoryModel.deleteMany({_id:_id})
        return res.json({
            message:"Delete category successfully",
            data:deleteCategory,
            error:false,
            success:true,
        })
    } catch(error){
        return response.status(500).json({
            message:error.message || error,
            success: false,
            error:true
        })
    }
}
