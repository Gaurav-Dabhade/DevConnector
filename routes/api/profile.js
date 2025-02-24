const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route  GET api/profile/me
//@desc    Get current users profile
//access   private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/profile
//@desc    Create or update user profile
//access   private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    //Build social object
    profileFields.social = {}; //need to initialized

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/profile
//@desc    Get all profiles
//access   public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/profile/user/:user_id
//@desc    Get profile by user ID
//access   public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/profile
//@desc    Delete profile,user & posts
//access   private

router.delete('/', auth, async (req, res) => {
  try {
    // remove profile
    const profile = await Profile.findOneAndDelete({ user: req.user.id });
    console.log('profie user id', req.user.id);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    // remove user
    const user = await User.findOneAndDelete({ _id: req.user.id });

    console.log('user id', req.user.id);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT api/profile/experience
//@desc    Add experience
//access   private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'This is required').not().isEmpty(),
      check('company', 'This is required').not().isEmpty(),
      check('from', 'This is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, descriptoin } =
      req.body;

    const newExp = { title, company, location, from, to, current, descriptoin };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  DELETE api/profile/experience/:exp_id
//@desc    Delete experience
//access   private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Experience not found' });
    }

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT api/profile/education
//@desc    Add education
//access   private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, descriptoin } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      descriptoin,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  DELETE api/profile/education/:edu_id
//@desc    Delete education
//access   private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Education is not found' });
    }

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
