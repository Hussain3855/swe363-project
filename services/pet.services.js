const { connectToDatabase } = require('../db'); // Reusing the database connection utility
const { ObjectId } = require('mongodb'); // MongoDB ObjectId utility

async function addPet(petData) {
  try {
    const db = await connectToDatabase();
    if (!db) throw new Error('Database connection failed');
    
    const petCollection = db.collection('Pet');
    const result = await petCollection.insertOne(petData);
    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error('Error adding pet:', error);
    return { success: false, error: error.message };
  }
}

async function getPets(filter = {}) {
  try {
      const db = await connectToDatabase();
      if (!db) throw new Error('Database connection failed');
      
      const petCollection = db.collection('Pet');
      const pets = await petCollection.find(filter).toArray();
      console.log('be pets:', pets);

      // Add absolute URLs for the image files
      const formattedPets = pets.map(pet => ({
          ...pet,
          pictureUrl: pet.picturePath ? `${process.env.SERVER_BASE_URL}/temp/pets/${pet.picturePath.split('\\').pop()}` : null
      }));

      return { success: true, data: formattedPets };
  } catch (error) {
      console.error('Error fetching pets:', error);
      return { success: false, error: error.message };
  }
}

async function getPetById(petId) {
  try {
    const db = await connectToDatabase();
    if (!db) throw new Error('Database connection failed');
    
    const petCollection = db.collection('Pet');
    const pet = await petCollection.findOne({ _id: new ObjectId(petId) });
    
    if (!pet) {
      throw new Error('No pet found with the given ID');
    }
    console.log('pet by id', pet);
    pet.pictureUrl = pet.picturePath ? `${process.env.SERVER_BASE_URL}/temp/pets/${pet.picturePath.split('\\').pop()}` : null;

    return { success: true, data: pet };
  } catch (error) {
    console.error('Error fetching pet:', error);
    return { success: false, error: error.message };
  }
}

async function updatePet(petId, updatedData) {
  const { ObjectId } = require('mongodb'); // MongoDB ObjectId utility
  try {
    const db = await connectToDatabase();
    if (!db) throw new Error('Database connection failed');
    
    const petCollection = db.collection('Pet');
    const result = await petCollection.updateOne(
      { _id: new ObjectId(petId) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      throw new Error('No pet found with the given ID');
    }

    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error('Error updating pet:', error);
    return { success: false, error: error.message };
  }
}

async function deletePet(petId) {
  const { ObjectId } = require('mongodb'); // MongoDB ObjectId utility
  try {
    const db = await connectToDatabase();
    if (!db) throw new Error('Database connection failed');
    
    const petCollection = db.collection('Pet');
    const result = await petCollection.deleteOne({ _id: new ObjectId(petId) });

    if (result.deletedCount === 0) {
      throw new Error('No pet found with the given ID');
    }

    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error('Error deleting pet:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  addPet,
  getPets,
  updatePet,
  deletePet,
  getPetById,
};
