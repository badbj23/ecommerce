import { User } from "../models/user.model.js";

export async function addAddys(req, res) {
    try{
        const {label, fullName, streetAddress, city, state, zip,phoneNumber, isDeafult } =
            req.body

        const user = req.user;

        if(isDeafult){
            user.addresses.forEach((address)=>{
                address.isDeafult = false;
            })
        }

        user.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zip,
            phoneNumber,
            isDefault: isDeafult || false,
        })

        await user.save();

        res.status(201).json({message:"success", addresses:user.addresses});



    } catch (error) {
        console.error("error adding addy", error);
        res.status(500).json({message:"something went wrong"});
    }
}

export async function getAddys(req, res) {
    try{
        const user = req.user;

        res.status(200).json({addresses:user.addresses});

    } catch (error) {
    console.error("error adding addy", error);
    res.status(500).json({message:"something went wrong"});
}
}

export async function updateAddys(req, res) {
    try{
        const {label, fullName, streetAddress, city, state, zip,phoneNumber, isDefault } =
        req.body

        const { addyId } =req.params

        const user = req.user;
        const addys = user.addresses.id(addyId);
        if(!addys) {
            return res.status(400).json({message:"no addys"});

        }

        if(isDefault){
            user.addresses.forEach((address)=>{
                address.isDeafult = false;
            })
        }

        addys.label = label || addys.label;
        addys.fullName = fullName || addys.fullName;
        addys.streetAddress = streetAddress || addys.streetAddress;
        addys.city = city || addys.city;
        addys.zip = zip || addys.zip;
        addys.phoneNumber = phoneNumber || addys.phoneNumber;
        addys.isDefault = isDefault !== undefined ? isDefault : addys.isDefault;

        await user.save();
        res.status(201).json({message:"success", addresses:user.addresses});


    } catch (error) {
        console.error("error getting addy", error);
        res.status(500).json({message:"something went wrong"});
    }
}
export async function deleteAddys(req, res) {
    try{
        const addyId = req.params.id;
        const user = req.user;

        user.addresses.pull(addyId);
        await user.save();
        res.status(201).json({message:"success", addresses:user.addresses});

    } catch (error) {
        console.error("error deleting addy", error);
        res.status(500).json({message:"something went wrong"});
    }

}

export async function getWishes(req, res) {
    try {
        const {productId} = req.body;
        const user = req.user;

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({message: "product already there"});
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(201).json({message: "success", wishlist: user.wishlist});

    } catch (error) {
        console.error("error adding wish", error);
        res.status(500).json({message:"something went wrong"});
    }
}

export async function deleteWishes(req, res) {
    try{
        const {productId} = req.params;
        const user = req.user;

        if (!user.wishlist.includes(productId)) {
            return res.status(400).json({message: "product not there"});
        }

        user.wishlist.pull(productId);
        await user.save();
        res.status(201).json({message:"success, removed from wishes", wishlist: user.wishlist});

    } catch (error) {
        console.error("error deleting addy", error);
        res.status(500).json({message:"something went wrong"});
    }
}

export async function addWishes(req, res) {
    try{
        const user = req.user;
        res.status(200).json({wishlist: user.wishlist});

    } catch (error) {
        console.error("error in wishes controller", error);
        res.status(500).json({message:"something went wrong"});
    }
}