
var outputSuc = function (res, mess) {

	return res.status(200).json(mess);
};
var outputFail = function (res, mess) {

	return res.status(500).json(mess);
};
export default {outputSuc,outputFail};