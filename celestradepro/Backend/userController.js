const User = require('./userModel');

const allSections = ['Top Market News', 'Top Stories', 'Top Gainers', 'Top Losers', 'Most Events','Trending stocks','Ecalendar','Fx Hours','Earning calendar','Stock Economic Calender']; // Define all possible sections


exports.loginOrFetchUser = async (req, res) => {
  const { email } = req.body;

  console.log('Received request body:', req.body);

  if (!email) {
    console.error('Email is missing in the request body');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        selectedSections: [], // Default: no sections selected
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in or fetching user:', error);
    res.status(500).json({ message: 'Error logging in or fetching user', error });
  }
};





// Function to update user selected sections
exports.updateSelectedSections = async (req, res) => {
  const { email, selectedSections } = req.body;

  if (!email || !selectedSections) {
    return res.status(400).json({ message: 'Email and selected sections are required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the selectedSections field
    user.selectedSections = selectedSections;
    await user.save();

    res.status(200).json({ message: 'Selected sections updated successfully.', user });
  } catch (error) {
    console.error('Error updating selected sections:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};





// Store email in MongoDB
exports.storeEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        let user = await User.findOne({ email });

        // If the user doesn't exist, create a new user with an empty watchlist
        if (!user) {
            user = new User({ email, watchlist: [] });
            await user.save();
        }

        // Check if the watchlist is empty and add default AAPL stock if necessary
        if (user.watchlist.length === 0) {
           const defaultWatchlist = [
                {
                    symbol: 'AAPL',
                    open: 150.0,
                    high: 155.0,
                    low: 145.0,
                    close: 152.0,
                    bid: 151.5,
                    ask: 152.0,
                    volume: 50000000,
                    type: 'stock'
                },
                {
                    symbol: 'EURUSD',
                    open: 1.0682048797607422,
                    high: 1.0746333599090576,
                    low: 1.0662003755569458,
                    close: 1.0682048797607422,
                    bid: 1.0781671,
                    ask: 1.0775863,
                    type: 'forex'
                },
                {
                    symbol: 'GC=F',
                    open: 1830.0999755859375,
                    high: 1830.0999755859375,
                    low: 1798.800048828125,
                    close: 1799.4000244140625,
                    bid: 1799.4000244140625,
                    ask: 1799.4000244140625,
                    type: 'com'
                }
            ];

              user.watchlist.push(...defaultWatchlist); // Add default stocks to the watchlist
            await user.save(); // Save the updated user document
        }

        res.status(200).json({ message: 'Email stored successfully', user });
    } catch (error) {
        console.error('Error storing email:', error);
        res.status(500).json({ message: 'Error storing email', error });
    }
  };

// Add stock to watchlist
exports.addToWatchlist = async (req, res) => {
    try {
        const { email, watchlist } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!Array.isArray(watchlist)) {
            return res.status(400).json({ message: 'Watchlist should be an array' });
        }

        const newItems = watchlist.filter(item => 
            !user.watchlist.some(existingItem => existingItem.symbol === item.symbol)
        );

        if (newItems.length > 0) {
            user.watchlist.push(...newItems);
            await user.save();
        }

        res.status(200).json({ message: 'Watchlist updated successfully', watchlist: user.watchlist });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch the user's watchlist
exports.getWatchlist = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ watchlist: user.watchlist });
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Error fetching watchlist', error });
    }
};

// Remove item from watchlist
exports.removeFromWatchlist = async (req, res) => {
    try {
        const { email, symbol } = req.body;

        if (!email || !symbol) {
            return res.status(400).json({ message: 'Email and symbol are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.watchlist = user.watchlist.filter(item => item.symbol.toLowerCase() !== symbol.toLowerCase());
        await user.save();

        res.status(200).json({ message: 'Item removed successfully', watchlist: user.watchlist });
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user theme from MongoDB
exports.getUserTheme = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ theme: user.theme || 'light' });
    } catch (error) {
        console.error('Error fetching user theme:', error);
        res.status(500).json({ message: 'Error fetching user theme', error });
    }
};

// Update user theme in MongoDB
exports.updateUserTheme = async (req, res) => {
    const { email, theme } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.theme = theme;
        await user.save();
        res.status(200).json({ message: 'Theme updated successfully' });
    } catch (error) {
        console.error('Error updating user theme:', error);
        res.status(500).json({ message: 'Error updating user theme', error });
    }
};

exports.archiveUserArticle = async (req, res) => {
    const { email } = req.params;
    const archivedArticle = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $push: { archivedArticles: archivedArticle } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error archiving article in user collection:', error);
        return res.status(500).json({ message: 'Error archiving article in user collection', error: error.message });
    }
};

// Controller to get archived articles for a user
exports.getArchivedArticles = async (req, res) => {
    const email = req.params.email; // Get email from parameters

    try {
        // Assuming you have a User model where archived articles are stored
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user.archivedArticles); // Return archived articles
    } catch (error) {
        console.error('Error fetching archived articles:', error);
        return res.status(500).json({ message: 'Error fetching archived articles', error: error.message });
    }
};

exports.archiveUserArticleop = async (req, res) => {
    const { email } = req.params;
    const archivedArticleop = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $push: { archivedArticlesop: archivedArticleop } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error archiving article in user collection:', error);
        return res.status(500).json({ message: 'Error archiving article in user collection', error: error.message });
    }
};

// Controller to get archived articles for a user
exports.getArchivedArticlesop = async (req, res) => {
    const email = req.params.email; // Get email from parameters

    try {
        // Assuming you have a User model where archived articles are stored
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user.archivedArticlesop); // Return archived articles
    } catch (error) {
        console.error('Error fetching archived articles:', error);
        return res.status(500).json({ message: 'Error fetching archived articles', error: error.message });
    }
};

exports.archiveUserArticlecom = async (req, res) => {
    const { email } = req.params;
    const archivedArticlecom = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $push: { archivedArticlescom: archivedArticlecom } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error archiving article in user collection:', error);
        return res.status(500).json({ message: 'Error archiving article in user collection', error: error.message });
    }
};

// Controller to get archived articles for a user
exports.getArchivedArticlescom = async (req, res) => {
    const email = req.params.email; // Get email from parameters

    try {
        
        // Assuming you have a User model where archived articles are stored
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user.archivedArticlescom); // Return archived articles
    } catch (error) {
        console.error('Error fetching archived articles:', error);
        return res.status(500).json({ message: 'Error fetching archived articles', error: error.message });
    }
};

exports.archiveUserArticlefox = async (req, res) => {
    const { email } = req.params;
    const archivedArticlefox = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $push: { archivedArticlesfox: archivedArticlefox } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error archiving article in user collection:', error);
        return res.status(500).json({ message: 'Error archiving article in user collection', error: error.message });
    }
};

// Controller to get archived articles for a user
exports.getArchivedArticlesfox = async (req, res) => {
    const email = req.params.email; // Get email from parameters

    try {
        
        // Assuming you have a User model where archived articles are stored
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user.archivedArticlesfox); // Return archived articles
    } catch (error) {
        console.error('Error fetching archived articles:', error);
        return res.status(500).json({ message: 'Error fetching archived articles', error: error.message });
    }
};

