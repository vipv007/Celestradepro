var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
const mongoose = require('mongoose');
const mongoUrl = 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = 'test';
console.log('Starting MongoDB setup...');
console.log('MongoDB Connection String:', mongoUrl);
console.log('Database Name:', dbName);
function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Connecting to MongoDB...');
            const startTime = Date.now();
            yield mongoose.connect(`${mongoUrl}/${dbName}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const connectionTime = Date.now() - startTime;
            console.log(`Connected to MongoDB at ${mongoUrl}/${dbName} in ${connectionTime}ms`);
            process.exit(0); // Exit script successfully
        }
        catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1); // Exit with error
        }
    });
}
setupDatabase();
//# sourceMappingURL=setupDb.js.map