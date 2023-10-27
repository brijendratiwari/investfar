const express = require('express');
const router = express.Router();
const firebase = require("../firebase");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUpdateUserInput = require('../../validation/updateUser');
const User = require('../../models/User');
const AllUser = require('../../models/AllUser');
const Company = require('../../models/Company');
const Property = require('../../models/Property');
const Propertyitem = require('../../models/Propertyitem');
const RequestProperty = require('../../models/RequestProperty');
const CompletedRequestProperty = require('../../models/CompletedRequestProperty');
const InvesterConsultant = require('../../models/InvesterConsultant');
const Categories = require('../../models/Categories');
const OfferedServies = require('../../models/OfferedServies');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { framework } = require('passport');
const firebase_file = require('firebase-admin');
const serviceAccount = require('../../config/investfar-b494a-firebase-adminsdk-4puhb-6f98327175.json'); // Replace with the correct path to your service account key JSON file
const firebaseConfig = {
  apiKey: "AIzaSyA2pq-jg4LFy8R_EgRCDmhD1qLZyZq7Xhw",
  authDomain: "investfar-b494a.firebaseapp.com",
  databaseURL: "https://investfar-b494a.firebaseio.com",
  projectId: "investfar-b494a",
  storageBucket: "investfar-b494a.appspot.com",
  messagingSenderId: "328462702651",
  appId: "1:328462702651:web:25e89ddd8c0260a385641e",
  measurementId: "G-MRT32PP2SW",
  credential:firebase_file.credential.cert(serviceAccount)
};
firebase_file.initializeApp(firebaseConfig);

router.post('/user-add', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            return res.status(200).json({ message: 'User added successfully. Refreshing data...' })
                        }).catch(err => console.log(err));
                });
            });
        }
    });
});

router.post('/user-data', (req, res) => {
    User.find({}).select(['-password']).then(user => {
        if (user) {
            return res.status(200).send(user);
        }
    });
});

router.post('/user-delete', (req, res) => {
    User.deleteOne({ _id: req.body._id }).then(user => {
        if (user) {
            return res.status(200).json({ message: 'User deleted successfully. Refreshing data...', success: true })
        }
    });
});

router.post('/user-update', (req, res) => {
    const { errors, isValid } = validateUpdateUserInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    User.findOne({ _id }).then(user => {
        if (user) {
            if (req.body.password !== '') {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                    });
                });
            }
            let update = { 'name': req.body.name, 'email': req.body.email, 'password': user.password };
            User.update({ _id: _id }, { $set: update }, function (err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update user.' });
                } else {
                    return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'Now user found to update.' });
        }
    });
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    if(email !== 'euphoriatek2010@gmail.com'){ 
      return res.status(400).json({success: false});
    }

   firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => { 
    const payload = {
        id: userCredential.user.email,
        name: userCredential.user.email
    };
    jwt.sign(
        payload,
        keys.secretOrKey,
        {
            expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
            res.json({
                success: true,
                token: 'Bearer ' + token
            });
        }
    );

  })
  .catch((error) => {
    console.log(error, email, password);
    const errorCode = error.code;
    const errorMessage = error.message;
    return res.status(400).json({success:false,error:error});
  });
   
  

    // console.log(user);
   


    // User.findOne({ email }).then(user => {
    //     if (!user) {
    //         return res.status(404).json({ email: 'Email not found' });
    //     }
    //     bcrypt.compare(password, user.password).then(isMatch => {
    //         if (isMatch) {
    //             const payload = {
    //                 id: user.id,
    //                 name: user.name
    //             };
    //             jwt.sign(
    //                 payload,
    //                 keys.secretOrKey,
    //                 {
    //                     expiresIn: 31556926 // 1 year in seconds
    //                 },
    //                 (err, token) => {
    //                     res.json({
    //                         success: true,
    //                         token: 'Bearer ' + token
    //                     });
    //                 }
    //             );
    //         } else {
    //             return res
    //                 .status(400)
    //                 .json({ password: 'Password incorrect' });
    //         }
    //     });
    // });
});

router.post('/forgot_email_password', async (req, res) => {
  try {
    const email = req.body.email;
    if(email !== 'euphoriatek2010@gmail.com'){
        return res.status(200).json({success:true,message:'Please Enter The Registered Admin Email ID.'});
    }
    await firebase.auth().sendPasswordResetEmail(email).then((result) => {
      return res.status(200).json({success:true,message:'Please Check Your Email Inbox. We Have Sent You A Link To Set A New Password.'});
    }).catch((error) => {
      return res.status(400).json({success:false,error:error});
    });
  } catch (error) {
      return res.status(400).json({success:false,error:error});
  }
});

router.get('/get_owner_property/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        const propertiesSnapshot = await firebase.firestore().collection('Properties').where('owner.id','==',userId).get();
        const properties = propertiesSnapshot.docs.map((doc) => doc.data());
        const arr = properties.map((item) => new Propertyitem(
              item.id,
              item.title,
              item.location.country,
              item.location.city,
              item.description.price,
              item.images,
              item.rating?.average,
              item.owner.name,
              item.seenBy,
              item.description.user_description,
              item.createdAt,
              item.propertyStatus,
              item.description.bath,
              item.description.bed,
              item.description.size
        ));
        res.json({
          success: true,
          listing: arr
        });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
});

// router.get('/test/:status', async (req, res) => {
// try{
// const propertiesSnapshot = await firebase.firestore().collection('OfferedServices').where('provider', '!=', null).get();
// const properties = propertiesSnapshot.docs.map((doc) => doc.data());

 
// res.json({
//   success: true,
//   listing: properties
// });
// } catch (error) {
// res.status(400).json({ message: error.message });
// }
// });

router.get('/get_companies/:status', async (req, res) => {
  try {
    const status = req.params.status;
    const propertiesSnapshot = await firebase.firestore().collection('OfferedServices').where('provider', '!=', null).get();
    const properties = propertiesSnapshot.docs.map((doc) => doc.data());
    const companySnapshot = await firebase.firestore().collection('Users').where('registration_type', '==', 'Company').where('status', '==', status).get();
    const companyData = companySnapshot.docs.map((doc) => doc.data());
    const combinedData = companyData.map((user) => {
    const matchingProperty = properties.filter((property) => property.provider.user_id === user.user_id);
        return {
          ...user,
          offerService: matchingProperty.length || 0 
        };
    });
    const arr = combinedData.map((item) => new Company(
      item.user_id,
      item.full_name,
      item.email,
      item.phone_number,
      item.address,
      item.avatar_url,
      item.status,
      item.registration_type,
      item.offerService
       // Add the property to the response
    ));
    res.json({
      success: true,
      listing: arr
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/get_all_user', async (req, res) => {
    try {
      const propertiesSnapshot = await firebase.firestore().collection('Properties').get();
      const properties = propertiesSnapshot.docs.map((doc) => doc.data());
  
      const userSnapshot = await firebase.firestore().collection('Users').where('registration_type', 'not-in', ['Company', 'Investor']).get();
      const users = userSnapshot.docs.map((doc) => doc.data());
  
      const combinedData = users.map((user) => {
      const matchingProperty = properties.filter((property) => property.owner.id === user.user_id);

        return {
          ...user,
          property: matchingProperty.length || 0 
        };
      });
  
      const arr = combinedData.map((item) => new AllUser(
        item.user_id,
        item.full_name,
        item.email,
        item.phone_number,
        item.address,
        item.avatar_url,
        item.property, 
        item.status
      ));
  
      res.json({
        success: true,
        listing: arr
      });
  
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.delete('/delete_users_status/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const querySnapshot = await firebase.firestore().collection('Users').where('user_id', '==', userId).get();
      if (querySnapshot.empty) {
        res.status(400).json({ message: error.message });
      }
      querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
        res.json({
          success: true
        });
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.put('/update_users_status/:id/:status', async (req, res) => {
  try {
    const userId = req.params.id;
    const isstatus = req.params.status;
    const propertiesSnapshot = await firebase.firestore().collection('Users').where('user_id', '==', userId).get();
    const updatePromises = [];
    propertiesSnapshot.forEach((doc) => {
      const docRef = firebase.firestore().collection('Users').doc(doc.id);
      updatePromises.push(docRef.update({
        status: isstatus
      }));
    });
    res.json({
      success: true
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/update_company_status/:id/:status', async (req, res) => {
  try {
    const userId = req.params.id;
    const isstatus = req.params.status;
    const propertiesSnapshot = await firebase.firestore().collection('Users').where('user_id', '==', userId).get();
    const updatePromises = [];
    propertiesSnapshot.forEach((doc) => {
      const docRef = firebase.firestore().collection('Users').doc(doc.id);
      updatePromises.push(docRef.update({
        status:isstatus
      }));
    });
    res.json({
      success: true
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/get_properties/:offerType', async (req, res) => {
    try {
      const offerType = req.params.offerType;
      const propertiesSnapshot = await firebase.firestore().collection('Properties').where('details.status', '==', offerType).get();
      const propertYData = propertiesSnapshot.docs.map((doc) => doc.data());
      const arr = propertYData.map((item) => new Propertyitem(
        item.id,
        item.title,
        item.location.country,
        item.location.city,
        item.description.price,
        item.images,
        item.rating?.average,
        item.owner.name,
        item.seenBy,
        item.description.user_description,
        item.createdAt,
        item.propertyStatus,
        item.description.bath,
        item.description.bed,
        item.description.size
      ));
      res.json({
        success: true,
        listing: arr
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.get('/get_single_property/:proId', async (req, res) => {
    try {
     const pramid = req.params.proId;
      const propertiesSnapshot = await firebase.firestore().collection('Properties').where('id', '==', pramid).get();
      const propertYData = propertiesSnapshot.docs.map((doc) => doc.data());

      if (propertYData.length === 0) {
          return res.status(404).json({ message: 'Property not found' });
      }
      const property = propertYData[0];
      // Fetch the owner's avatar URL from the Users collection using the owner's user ID
      const ownerSnapshot = await firebase.firestore().collection('Users').doc(property.owner.id).get();
      const ownerData = ownerSnapshot.data();      
      const updatedProperty = {
        ...property,
        avatar_url: ownerData.avatar_url
      };
      const arr = [updatedProperty].map((item) => new Property(
            item.id,
            item.title,
            item.location.country,
            item.location.city,
            item.description.price,
            item.images,
            item.rating?.average,
            item.owner.name,
            item.seenBy,
            item.description.user_description,
            item.createdAt,
            item.propertyStatus,
            item.description.bath,
            item.description.bed,
            item.description.size,
            item.avatar_url,
            item.description.type,
            item.description.amenities.data,
            item.description.amenities.obj
      ));
      res.json({
        success: true,
        listing: arr
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.put('/update_properties_status/:id/:status', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const isstatus = req.params.status;
    const propertiesSnapshot = await firebase.firestore().collection('Properties').where('id', '==', propertyId).get();
    const updatePromises = [];
    propertiesSnapshot.forEach((doc) => {
      const docRef = firebase.firestore().collection('Properties').doc(doc.id);
      updatePromises.push(docRef.update({
        propertyStatus:isstatus
      }));
    });
    res.json({
      success: true
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete_properties/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const querySnapshot = await firebase.firestore().collection('Properties').where('id', '==', propertyId).get();
    if (querySnapshot.empty) {
      res.status(400).json({ message: error.message });
    }
    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
      res.json({
        success: true
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/properties_requests/:status', async (req, res) => {
  try {
    const status = req.params.status;
    if(status =='pending'){
        const companySnapshot = await firebase.firestore().collection('BookedServices').get();
        const companyData = companySnapshot.docs.map((doc) => doc.data());
        const arr = companyData.map((item) => new RequestProperty(
          item.requestor.user_id,
          item.requestor.name,
          item.requestor.email,
          item.requestor.phone_number,
          item.requestor.avatar_url,
          item.status,
          item.created,
          item.message,
          item.image,
          item.name
        ));
        res.json({
          success: true,
          listing: arr
        });
    }else{
      const companySnapshot = await firebase.firestore().collection('CompletedServices').get();
      const companyData = companySnapshot.docs.map((doc) => doc.data());
      const arr = companyData.map((item) => new CompletedRequestProperty(
        item.requestor.user_id,
        item.requestor.name,
        item.requestor.email,
        item.requestor.phone_number,
        item.requestor.avatar_url,
        item.status,
        item.created,
        item.message,
        item.image,
        item.name
      ));
      res.json({
        success: true,
        listing: arr
      });
    }
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/get_invester_consultant', async (req, res) => {
  try {
    const companySnapshot = await firebase.firestore().collection('BookedServices').get();
    const companyData = companySnapshot.docs.map((doc) => doc.data());
    const arr = companyData.map((item) => new InvesterConsultant(
      item.created,
      item.requestor.user_id,
      item.requestor.name,
      item.requestor.email,
      item.requestor.phone_number,
      item.requestor.avatar_url,
      item.provider.user_id,
      item.provider.name,
      item.provider.email,
      item.provider.phone_number,
      item.provider.avatar_url,
      item.provider.company,
      item.location.state,
      item.location.country
    ));
    res.json({
      success: true,
      listing: arr
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/category_subcategory', async (req, res) => {
  try{
    const propertyCategories = [
      {"name":"General Contractor", 'categoryImg':'http://reinvestfar.com/mobileapp_api/public/storage/category/Carpenter.png', "subcategory": [{"name":"Kitchen Remodel"},{"name":"Custom Home Build"}],'count':8},
      {"name":"Cleaning", 'categoryImg':'http://reinvestfar.com/mobileapp_api/public/storage/category/Cleaning.png', "subcategory": [{"name":"Bathroom Cleaning"},{"name":"Carpet Cleaning"}],'count':8},
      {"name":"Lending", 'categoryImg':'http://reinvestfar.com/mobileapp_api/public/storage/category/Lending.jpg', "subcategory": [{"name":"Construction"},{"name":"Rental Loans"}],'count':8},
      {"name":"Plumbing", 'categoryImg':'http://reinvestfar.com/mobileapp_api/public/storage/category/Plumbing.png', "subcategory": [{"name":"Back Flow Prevention"},{"name":"Bathtubs & Shower"}],'count':8},
      {"name":"Property Management", 'categoryImg':'http://reinvestfar.com/mobileapp_api/public/storage/category/Carpenter.png', "subcategory": [{"name":"Property Management"},{"name":"Canada Property Management"}],'count':2}
    ];
    const arr = propertyCategories.map((item) => new Categories(
      item.name,
      item.subcategory,
      item.count,
      item.categoryImg
    ));
    res.json({
      success: true,
      listing: arr
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/get_offered_service/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const propertiesSnapshot = await firebase.firestore().collection('OfferedServices').where('provider.user_id', '==', userId).get();
    const properties = propertiesSnapshot.docs.map((doc) => doc.data());
    const arr = properties.map((item) => new OfferedServies(
      item.provider.user_id,
      item.provider.company,
      item.provider.email,
      item.provider.phone_number,
      item.provider.avatar_url,
      item.image,
      item.subCatagory,
      item.name,
      item.price,
      item.catagory,
      item.location.country,
      item.location.state
       // Add the property to the response
    ));
    res.json({
      success: true,
      listing: arr
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/add-blog', upload.single('file'), async (req, res) => {
  const file = req.file;
  try {
    const data = req.body;

    // Generate a unique timestamp for the file name
    if(file){
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.originalname}`;

    // Construct the file path in the Firebase Storage bucket
    const bucket = firebase_file.storage().bucket(); // Get the default Firebase Storage bucket
    const folderName = 'blog'; // Specify the folder path
    const fullPath = `${folderName}/${fileName}`; // Include the folder path in the file name

    const uploadTask = bucket.file(fullPath).createWriteStream();
    uploadTask.end(file.buffer);

    // Add the file path to the data object
    data.filePath = fullPath;
    }
    if (data.id) {
      const blogRef = firebase.firestore().collection('Blog').doc(data.id);
      await blogRef.update(data);
      res.status(200).json({ message: 'Blog updated successfully' });
    } else {
      const docRef = await firebase.firestore().collection('Blog').add(data);
      res.status(200).json({ message: 'Data added successfully', id: docRef.id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/get-blog', async (req, res) => {
  try {
    const propertiesSnapshot = await firebase.firestore().collection('Blog').get();
    const properties = propertiesSnapshot.docs.map(async (doc) => {
      const data = doc.data();

      // Retrieve the full image path from Firebase Storage
      const bucket = firebase_file.storage().bucket(); // Initialize the Firebase Admin SDK
      const filePath = data.filePath; // Assuming 'filePath' is the field where the image path is stored

      const file = bucket.file(filePath);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // Include the full image path in the response
      data.fullImagePath = signedUrl;

      return {
        id: doc.id,
        data: data,
      };
    });

    const results = await Promise.all(properties);

    res.json({
      success: true,
      listing: results,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete-blog/:postId', async (req, res) => {
  try {
    const postId = req.params.postId; // Get the post ID from the request URL

    // Fetch the blog post document from Firestore to get the image path
    const blogRef = firebase.firestore().collection('Blog').doc(postId);
    const doc = await blogRef.get();
    const data = doc.data();

    if (data) {
      const imagePath = data.filePath; // Assuming 'filePath' is the field where the image path is stored

      // Delete the image from Firebase Storage
      const bucket = firebase_file.storage().bucket();
      const file = bucket.file(imagePath);
      await file.delete();

      // Delete the blog post document from Firestore
      await blogRef.delete();

      res.status(200).json({ message: 'Blog post and associated image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-blog-app', async (req, res) => {
  try {
    const propertiesSnapshot = await firebase.firestore().collection('Blog').get();
    const properties = propertiesSnapshot.docs.map(async (doc) => {
      const data = doc.data();

      // Retrieve the full image path from Firebase Storage
      const bucket = firebase_file.storage().bucket(); // Initialize the Firebase Admin SDK
      const filePath = data.filePath; // Assuming 'filePath' is the field where the image path is stored

      const file = bucket.file(filePath);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // Include the full image path in the response
      data.fullImagePath = signedUrl;

      return {
        id: doc.id,
        data: data,
      };
    });

    const results = await Promise.all(properties);

    res.json({
      success: true,
      listing: results,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;