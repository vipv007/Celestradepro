var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Profile = require('./profileModel');
exports.getAllProfiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const profiles = yield Profile.find();
        res.status(200).json(profiles);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getprofileById = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const profile = yield Profile.findById(req.params.id);
        res.status(200).json(profile);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.createprofile = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const profile = new profile({
        title: req.body.title,
        content: req.body.content,
    });
    try {
        const newprofile = yield profile.save();
        res.status(201).json(newprofile);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.updateprofile = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const updatedprofile = yield profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedprofile);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.deleteprofile = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield profile.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'profile deleted successfully' });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
//# sourceMappingURL=profileController.js.map