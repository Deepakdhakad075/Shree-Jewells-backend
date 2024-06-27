const cloudinary = require("cloudinary").v2;

const Item = require("../models/Item");
const { uploadImageToCloudinary, uploadVideoToCloudinary } = require("../utils/imageUploader");


exports.createItem = async (req, res) => {
    try {  
      
        const {
            itemName,
            grossWeight,
            netGoldWeight,
            goldRate,
            roundDiamondWeight,
            roundDiamondRate,
            polkiDiamondWeight,
            polkiDiamondRate,
            stoneWeight,
            stoneType,
            stoneRate,
            laborCharge,
            totalRate,
            category
        } = req.body;

        const image = req.files && req.files.image;
        const video = req.files && req.files.video;

        if (
            !itemName ||
            !grossWeight ||
            !netGoldWeight ||
            !goldRate ||
            !roundDiamondWeight ||
            !roundDiamondRate ||
            !polkiDiamondWeight ||
            !polkiDiamondRate ||
            !stoneWeight ||
            !stoneType ||
            !stoneRate ||
            !laborCharge ||
            !totalRate ||
            !image ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }

        const uploadedImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME, 1000, 1000);
        const uploadedVideo = video ? await uploadVideoToCloudinary(video, process.env.FOLDER_NAME) : null;

        const newItem = await Item.create({
            itemName,
            category,
            grossWeight,
            netGoldWeight,
            goldRate,
            roundDiamondWeight,
            roundDiamondRate,
            polkiDiamondWeight,
            polkiDiamondRate,
            stoneWeight,
            stoneType,
            stoneRate,
            laborCharge,
            totalRate,
            image: uploadedImage.secure_url,
            video: uploadedVideo ? uploadedVideo.secure_url : null,
        });

        res.status(201).json({
            success: true,
            data: newItem,
            message: "Item Created Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create item",
            error: error.message,
        });
    }
}

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({
            success: true, data: items,
            message: "Fetched all items successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch items",
            error: error.message,
        });
    }
}

exports.getItemById = async (req, res) => {
    try { 
        
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      console.error('Failed to fetch item:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch item', error: error.message });
    }
  };

//   exports.updateItem = async (req, res) => {
//     try {
//         const itemId = req.params.id;

//         const {
//             itemName,
//             grossWeight,
//             netGoldWeight,
//             goldRate,
//             roundDiamondWeight,
//             roundDiamondRate,
//             polkiDiamondWeight,
//             polkiDiamondRate,
//             stoneWeight,
//             stoneType,
//             stoneRate,
//             laborCharge,
//             totalRate,
//         } = req.body;

//         const image = req.files && req.files.image;
//         const video = req.files && req.files.video;

//         let updatedItem = {
//             itemName,
//             grossWeight,
//             netGoldWeight,
//             goldRate,
//             roundDiamondWeight,
//             roundDiamondRate,
//             polkiDiamondWeight,
//             polkiDiamondRate,
//             stoneWeight,
//             stoneType,
//             stoneRate,
//             laborCharge,
//             totalRate,
//         };

//         if (image) {
//             const uploadedImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME, 1000, 1000);
//             updatedItem.image = uploadedImage.secure_url;
//         }

//         if (video) {
//             const uploadedVideo = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
//             updatedItem.video = uploadedVideo.secure_url;
//         }

//         const updatedItemDetails = await Item.findByIdAndUpdate(itemId, updatedItem, { new: true });

//         if (!updatedItemDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Item not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: updatedItemDetails,
//             message: "Item Updated Successfully",
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to update item",
//             error: error.message,
//         });
//     }
// }
exports.updateItem = async (req, res) => {
    try {
      const itemId = req.params.id;
      const updates = req.body;
      const item = await Item.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
  
      // If Image is found, update it
      if (req.files && req.files.image) {
        const image = req.files.image;
        const uploadedImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME, 1000, 1000);
        item.image = uploadedImage.secure_url;
      }
  
      // If Video is found, update it
      if (req.files && req.files.video) {
        const video = req.files.video;
        const uploadedVideo = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
        item.video = uploadedVideo.secure_url;
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          item[key] = updates[key];
        }
      }
  
      await item.save();
  
      const updatedItem = await Item.findById(itemId);
      res.json({
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  

  exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id);
      

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        // Extract Public IDs from URLs
        const extractPublicId = (url, resourceType) => {
            const parts = url.split('/');
            const filename = parts.pop();
            const folder = parts.slice(parts.indexOf(resourceType) + 1, -1).join('/');
            return `${folder}/${filename.split('.')[0]}`;
        };

        const imagePublicId = extractPublicId(item.image, 'image');
        const videoPublicId = extractPublicId(item.video, 'video');
       

        // Delete image if exists
        if (imagePublicId) {
            try {
                const result = await cloudinary.uploader.destroy(imagePublicId, { resource_type: 'image' });
              
            } catch (err) {
                console.error(err, 'Error deleting image from Cloudinary');
            }
        }

        // Delete video if exists
        if (videoPublicId) {
            try {
                const result = await cloudinary.uploader.destroy(videoPublicId, { resource_type: 'video' });
              
            } catch (err) {
                console.error(err, 'Error deleting video from Cloudinary');
            }
        }

        // Delete item from the database
        const deletedItem = await Item.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            data: deletedItem,
            message: "Item Deleted Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete item",
            error: error.message,
        });
    }
};
