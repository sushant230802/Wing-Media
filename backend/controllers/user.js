const User=require("../models/User")
const Post=require("../models/Post");

exports.registerUser= async (req,res)=>{;

try{
    const {name,email,password}=req.body;

    let user=await User.findOne({email});
    if(user){
        return res
        .status(400)
        .json({success:false,message:"user already exists"})
    }
    user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"sample_id",
            url:"sample_url"
        }
    })
    const token=await user.generateToken();
    const options={
        expires:new Date(Date.now() + 90*24*60*60*1000),
        httpOnly:"true",
    }

    res.status(200).cookie("token",token,options).json({
        success:"true",
        user,
        token,
    })

} catch(error){
    res.status(500).json({
        success:false,
        message:error.message,
    })
}
}

exports.login= async(req,res)=>{
    try{
        const { email, password} = req.body;
        const user=await User.findOne({email}).select("+password");

        if(!user){
            return res
            .status(400)
            .json({
            success:"false",
            message:"user doesn't exist",
            })
        }

        const isMatch= await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success:"false",
                message:"incorrect password",
            })
        }
        const token=await user.generateToken();
        const options={
            expires:new Date(Date.now() + 90*24*60*60*1000),
            httpOnly:"true",
        }

        res.status(200).cookie("token",token,options).json({
            success:"true",
            message:"login successful",
            user,
            token,
        })
    }catch(error){
        res.status(500).json({
                success:false,
                message:error.message,
            })
    }
}

exports.logout=async (req,res)=>{
    try{
        res.status(200)
        .cookie("token",null,{expires:new Date(Date.now()), httpOnly:true})
        .json({
            success:"true",
            message:"log out successful",
        })
    }
    catch(error){
        res.status(500).json({
            success:"false",
            message:error.message,
        })
    }
}

exports.followUser=async(req,res)=>{
    try{
        const userTofollow= await User.findById(req.params.id);
        const loggedUser=await User.findById(req.user._id);

        if(!userTofollow){
            return res.status(404).json({
                success:"false",
                message:"user not found",
            })
        }

        if(loggedUser.followings.includes(userTofollow._id)){
            const indexfollowing= loggedUser.followings.indexOf(userTofollow._id);
            const indexfollowers=userTofollow.followers.indexOf(loggedUser._id);

            loggedUser.followings.splice(indexfollowing,1);
            userTofollow.followers.splice(indexfollowers,1);

            await loggedUser.save();
            await userTofollow.save();

            return res.status(200).json({
                success:"true",
                message:"user unfollowed",
            })
        }

        loggedUser.followings.push(userTofollow._id);
        userTofollow.followers.push(loggedUser._id);

        await loggedUser.save();
        await userTofollow.save();

        return res.status(200).json({
            success:"true",
            message:"user followed",
        })

    }
    catch(error){
        res.status(500).json({
            success:"false",
            message:error.message,
        })
    }
}

exports.updatePassword=async (req,res)=>{
    try{
        const user=await User.findById(req.user._id).select("+password");

        const {oldPassword,newPassword}=req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:"false",
                message:"please provide old and new password",
            })
        }

        const isMatch=await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(400).json({
                success:"false",
                message:"incorrect old password",
            })
        }

        user.password=newPassword;
        await user.save();

        res.status(200).json({
            success:"true",
            message:"password updated",
        })


    }
    catch(error){
        res.status(500).json({
            success:"false",
            message:error.message,
        })
    }
}

exports.updateProfile=async (req,res)=>{
    try{
    const user=await User.findById(req.user._id);
    const {newName,newEmail}=req.body;
    if(newName){
        user.name=newName;
    }
    if(newEmail){
        user.email=newEmail;
    }
    await user.save();

    res.status(200).json({
        success:"true",
        message:"profile updated "
    })
} catch(error){
    res.status(500).json({
        success:"false",
        message:error.message,
    })
}
}

exports.deleteProfile=async (req,res)=>{
    try{
        const user=await User.findById(req.user._id);
        const posts=user.posts;
        const followers=user.followers;
        const followings=user.followings;
        const userId=user._id;
        await user.deleteOne();

        // logout user after deleting profile
        res.status(200)
        .cookie("token",null,{expires:new Date(Date.now()), httpOnly:true});

        //delete all posts of user
        for(let i=0;i<posts.length;i++){
            const post =await Post.findById(posts[i])
            await post.deleteOne();
        }

        // removing user from follower following
        for(let i=0;i<followers.length;i++){
            const follower=await User.findById(followers[i]);
            const index= follower.followings.indexOf(userId);
            follower.followings.splice(index,1);
            await follower.save();
        }

        // removing user from following follower
        for(let i=0;i<followings.length;i++){
            const following=await User.findById(followings[i]);
            const index= following.followers.indexOf(userId);
            following.followers.splice(index,1);
            await following.save();
        }

        res.status(200).json({
            success:"true",
            message:"profile deleted"
        })
    }
    catch(error){
        res.status(500).json({
            success:"false",
            message:error.message,
        })
    }
};

exports.myProfile=async (req,res)=>{
    try{
        const user=await User.findById(req.user._id).populate("posts");

        res.status(200).json({
            success:"true",
            user,
        })

    }
    catch(error){
        res.status(500).json({
            success:"false",
            message:error.message,
        })
    }
};

exports.getUserProfile=async (req,res)=>{
    try{
        const user=await User.findById(req.params.id).populate("posts");

        if(!user){
            return res.status(404).json({
                success:"false",
                message:"user not found",
            })
        }

        res.status(200).json({
            success:"true",
            user,
        })
    } catch(error){
        res.status(500).json({
            success:"false",
            message:error.message,
        })
    }
}


exports.getAllUsers=async (req,res)=>{
    try{
        const users=await User.find({});
        res.status(200).json({
            success:"true",
            users,
        })
    } catch(error){
        res.status(500).json({
            success:"false",
            message:error.message,
        })
    }
}