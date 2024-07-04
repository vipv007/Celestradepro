const express = require('express');
const router = express.Router();
const EventController = require('./EventController');
const interestController = require('./interestController');
const CalendarController = require('./CalendarController');
const PortfolioController = require('./PortfolioController');
const profileController = require('./profileController');
const forexController = require('./forexController');
const stockController = require('./stockController');
const optionsController = require('./optionsController');
const trendsController = require('./trendsController');
const CommodityController = require('./CommodityController');
const earningController = require('./earningController');
const newsController = require('./newsController');
const ratioController = require('./ratioController');
const vixController = require('./vixController');
const screenerController = require('./screenerController');
const crossrateController = require('./crossrateController');
const volatilityController = require('./volatilityController');
const fnewsController = require('./fnewsController');
const openintrestController = require('./openintrestController');
const niftyController = require('./niftyController');
const com_newsController = require('./com_newsController');
const optionnewsController = require('./optionnewsController');
const CalrepController = require('./CalrepController');
const transactionController = require('./transactionController');
const marketdepthController = require('./marketdepthController');
const Option_ChainController = require('./Option_ChainController');
const fortopgainerController = require('./fortopgainerController');
const StockGainerController = require('./StockGainerController');
const commodityGainerController = require('./commoditygainerController');
const hourController = require('./hourController');
const technicalController = require('./technicalController');

const comindexController = require('./comindexController');
const frxindexController = require('./frxindexController');
const OptionactiveController = require('./OptionactiveController');


// Define routes

router.get('/', newsController.getAllNews);
router.put('/:id/archive', newsController.archiveNews);
router.put('/:id/restore', newsController.restoreNews);
router.get('/interests', interestController.getAllInterests);
router.get('/forexs', forexController.getAllForexs);
router.put('/forexs/addSelectedForex', forexController.addSelectedForex);
router.put('/forexs/removeSelectedForex', forexController.removeSelectedForex);
router.get('/forexs/selected', forexController.getSelectedForexs);
router.put('/stocks/addSelectedStock', stockController.addSelectedStock);
router.put('/stocks/removeSelectedStock', stockController.removeSelectedStock);
router.get('/forexs/:symbol', forexController.getDataBySymbol);
router.get('/profiles', profileController.getAllProfiles);
router.get('/stocks', stockController.getAllStocks);
router.get('/stocks', stockController.getSelectedStocks);
router.get('/stocks/:symbol', stockController.getStockBySymbol); // Define a separate route for getting stock by symbol
router.get('/options', optionsController.getOptions);
router.get('/options_chain', Option_ChainController.getoptions);
router.get('/trends', trendsController.getAllTrends);
router.get('/commodity', CommodityController.getCommodity);
router.get('/commodity/:Symbol', CommodityController.getDataBySymbol);
router.get('/commodity/selected', CommodityController.getSelectedComs);
router.put('/commodity/addSelectedCom', CommodityController.addSelectedCom);
router.put('/commodity/removeSelectedCom', CommodityController.removeSelectedCom);
router.get('/vix', vixController.getVix);
router.get('/crossrates', crossrateController.getCrossrate);
router.get('/earnings', earningController.getAllEarnings);
router.get('/news', newsController.getAllNews);
router.get('/fnews', fnewsController.getAllFnews);
router.get('/screener', screenerController.getAllScreener);
router.get('/com_news', com_newsController.getCom_news);
router.get('/optionnews', optionnewsController.getOptionnews);
router.get('/ratios', ratioController.getAllRatios);
router.get('/openintrest', openintrestController.getOpenintrest);
router.get('/nifty', niftyController.getNifty);
router.get('/events', EventController.getAllEvents);
router.get('/volatility', volatilityController.getAllVolatility);
router.get('/calendar', CalendarController.getAllCalendar);
router.get('/portfolio', PortfolioController.getAllPortfolio);
router.post('/portfolio', PortfolioController.createPortfolio);
router.put('/portfolio/:id/updateOrderType', PortfolioController.updateOrderType);
router.post('/transactions', transactionController.createTransaction);
router.get('/marketdepth', marketdepthController.getAllMarketDepth);
router.get('/Calendarrep', CalrepController.getAllCalendardata);
router.get('/gainers', fortopgainerController.getAllGainers);
router.get('/top-gainers-and-losers', fortopgainerController.getTopGainersAndLosers);
router.get('/gainer-loser', StockGainerController.getAllGainersAndLosers);
router.get('/gainer-loser', StockGainerController.getGainersAndLosers);
router.get('/all', commodityGainerController.getAllComGainers);
router.get('/gainers-losers', commodityGainerController.getComGainersLosers);
router.get('/hour', hourController.getHour);
router.get('/technical', technicalController.getTechnical);

router.get('/comindex', comindexController.getComindex);
router.get('/frxindex', frxindexController.getFrxindex);
router.get('/active', OptionactiveController.getAllActive);


module.exports = router;
