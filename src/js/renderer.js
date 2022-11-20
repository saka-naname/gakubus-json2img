import ejs from "ejs";
import nodeHtmlToImage from "node-html-to-image";
import { parseSchoolbusJson, lookupTsId } from "./parser.js";

export function renderBusTimesheet(parsedJsonData, month, day, start, end){
    const tsId = lookupTsId(parsedJsonData, month, day);
    let ts = [];
    if(tsId !== "none"){
        ts = parsedJsonData.timesheet[tsId].list.filter(item => start <= item.time && item.time <= end);
    }

    return ejs.renderFile("./../src/ejs/twitter_layout_4x3.ejs", {
        data: {
            json: parsedJsonData,
            tsid: tsId,
            ts: ts,
            month: month,
            day: day,
            start: start,
            end: end,
        },
        content: "include/timesheet_bus",
    }, {async: true})
    .then(str => {
        console.debug(str);
        return nodeHtmlToImage({
            html: str,
        });
    })
    .catch(err => {
        console.error(err);
    })
}
