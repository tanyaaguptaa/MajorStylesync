
const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');

/**
 * @param req  
 * @param res  
 * @return address
 */
const addAddress = asyncHandler(async (req, res) => {
  const { name, address, pincode, phoneNo, email } = req.body;

  const newAddress = new Address({
    user: req.user._id,
    name,
    address,
    pincode,
    phoneNo,
    email,
  });

  const createdAddress = await newAddress.save();
  res.status(201).json(createdAddress);
});

/**
 *
 * @param req  
 * @param res  
 * @return address
 */
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(addresses);
});


/**
 * 
 *
 * @param req  
 * @param res  
 * @return  deletes an address
 */
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address && address.user.toString() === req.user._id.toString()) {
    await address.remove();
    res.json({ message: 'Address removed' });
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});


/**
 * @param req  
 * @param res  
 * @return  
 */
const updateAddress = asyncHandler(async (req, res) => {
  const { name, address, pincode, phoneNo, email } = req.body;

  const addressToUpdate = await Address.findById(req.params.id);

  if (addressToUpdate && addressToUpdate.user.toString() === req.user._id.toString()) {
    addressToUpdate.name = name || addressToUpdate.name;
    addressToUpdate.address = address || addressToUpdate.address;
    addressToUpdate.pincode = pincode || addressToUpdate.pincode;
    addressToUpdate.phoneNo = phoneNo || addressToUpdate.phoneNo;
    addressToUpdate.email = email || addressToUpdate.email;

    const updatedAddress = await addressToUpdate.save();
    res.json(updatedAddress);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

module.exports = {
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
};
