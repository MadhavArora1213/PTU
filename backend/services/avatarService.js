const db = require('../config/database');

// Default avatar options
const defaultAvatars = [
  {
    type: 'male_1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=male1&backgroundColor=b6e3f4,c0aede,d1d4f9',
    name: 'Male Avatar 1'
  },
  {
    type: 'male_2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=male2&backgroundColor=ffd5dc,ffdfbf,c0aede',
    name: 'Male Avatar 2'
  },
  {
    type: 'female_1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female1&backgroundColor=b6e3f4,c0aede,d1d4f9',
    name: 'Female Avatar 1'
  },
  {
    type: 'female_2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female2&backgroundColor=ffd5dc,ffdfbf,c0aede',
    name: 'Female Avatar 2'
  },
  {
    type: 'neutral_1',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=neutral1&backgroundColor=b6e3f4,c0aede,d1d4f9',
    name: 'Robot Avatar 1'
  },
  {
    type: 'neutral_2',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=neutral2&backgroundColor=ffd5dc,ffdfbf,c0aede',
    name: 'Robot Avatar 2'
  },
  {
    type: 'animal_1',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal1&backgroundColor=b6e3f4,c0aede,d1d4f9',
    name: 'Fun Avatar 1'
  },
  {
    type: 'animal_2',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal2&backgroundColor=ffd5dc,ffdfbf,c0aede',
    name: 'Fun Avatar 2'
  }
];

// Get available avatars
const getAvailableAvatars = () => {
  return defaultAvatars;
};

// Get user's current avatar
const getUserAvatar = async (userId) => {
  try {
    const result = await db.query(
      'SELECT avatar_url, avatar_type FROM user_avatars WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length > 0) {
      return {
        success: true,
        avatar: result.rows[0]
      };
    } else {
      // Return default avatar if none set
      return {
        success: true,
        avatar: {
          avatar_type: 'default',
          avatar_url: defaultAvatars[0].url
        }
      };
    }
  } catch (error) {
    console.error('Error getting user avatar:', error);
    return {
      success: false,
      message: 'Failed to get user avatar'
    };
  }
};

// Update user avatar
const updateUserAvatar = async (userId, avatarType, avatarUrl = null) => {
  try {
    // If no custom URL provided, use default avatar URL
    if (!avatarUrl) {
      const defaultAvatar = defaultAvatars.find(avatar => avatar.type === avatarType);
      if (defaultAvatar) {
        avatarUrl = defaultAvatar.url;
      } else {
        avatarUrl = defaultAvatars[0].url; // Fallback to first avatar
        avatarType = defaultAvatars[0].type;
      }
    }
    
    // Check if user already has an avatar record
    const existingResult = await db.query(
      'SELECT id FROM user_avatars WHERE user_id = $1',
      [userId]
    );
    
    if (existingResult.rows.length > 0) {
      // Update existing avatar
      await db.query(
        'UPDATE user_avatars SET avatar_type = $1, avatar_url = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3',
        [avatarType, avatarUrl, userId]
      );
    } else {
      // Insert new avatar record
      await db.query(
        'INSERT INTO user_avatars (user_id, avatar_type, avatar_url) VALUES ($1, $2, $3)',
        [userId, avatarType, avatarUrl]
      );
    }
    
    // Also update the avatar_url in users table for easy access
    await db.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2',
      [avatarUrl, userId]
    );
    
    return {
      success: true,
      message: 'Avatar updated successfully',
      avatar: {
        avatar_type: avatarType,
        avatar_url: avatarUrl
      }
    };
  } catch (error) {
    console.error('Error updating user avatar:', error);
    return {
      success: false,
      message: 'Failed to update avatar'
    };
  }
};

// Generate custom avatar URL based on user data
const generateCustomAvatar = (userData) => {
  const { name, email, userType } = userData;
  
  // Create a seed based on user data
  const seed = `${name}-${email}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Choose avatar style based on user type
  let style = 'avataaars';
  let backgroundColor = 'b6e3f4,c0aede,d1d4f9';
  
  switch (userType) {
    case 'student':
      style = 'avataaars';
      backgroundColor = 'b6e3f4,c0aede,d1d4f9';
      break;
    case 'salaried':
      style = 'avataaars';
      backgroundColor = 'ffd5dc,ffdfbf,c0aede';
      break;
    case 'business':
      style = 'bottts';
      backgroundColor = 'ffdfbf,ffd5dc,b6e3f4';
      break;
    default:
      style = 'fun-emoji';
      backgroundColor = 'c0aede,d1d4f9,b6e3f4';
  }
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${backgroundColor}`;
};

// Initialize default avatar for new user
const initializeUserAvatar = async (userId, userData) => {
  try {
    const customUrl = generateCustomAvatar(userData);
    const avatarType = `custom_${userData.userType}`;
    
    const result = await updateUserAvatar(userId, avatarType, customUrl);
    return result;
  } catch (error) {
    console.error('Error initializing user avatar:', error);
    return {
      success: false,
      message: 'Failed to initialize avatar'
    };
  }
};

// Delete user avatar (reset to default)
const resetUserAvatar = async (userId) => {
  try {
    const defaultAvatar = defaultAvatars[0];
    const result = await updateUserAvatar(userId, defaultAvatar.type, defaultAvatar.url);
    return result;
  } catch (error) {
    console.error('Error resetting user avatar:', error);
    return {
      success: false,
      message: 'Failed to reset avatar'
    };
  }
};

module.exports = {
  getAvailableAvatars,
  getUserAvatar,
  updateUserAvatar,
  generateCustomAvatar,
  initializeUserAvatar,
  resetUserAvatar,
  defaultAvatars
};