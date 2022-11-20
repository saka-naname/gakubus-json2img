/*
    芝浦工大学バススケジュール.jsonをいい感じに整形するやつ
*/

//  湘南新宿ライン判定用
const willJS = ["大", "逗"];

function parseSchoolbusJson(jsonData) {
    return new Promise((resolve) => {
        //  サイト設定
        let siteInfo = {};
        for (const key of ["status", "up_time", "title", "info_view", "info_title", "info_text"]) {
            siteInfo[key] = jsonData.site_info[0][key];
        }
        siteInfo.will = {};
        //  上りには湘南新宿ラインかを判定するデータを付与する
        siteInfo.will.up = {};
        for (const item of jsonData.site_info[0].will.up) {
            siteInfo.will.up[item.mark] = {...item, js: willJS.includes(item.name)};
        }
        siteInfo.will.down = {};
        for (const item of jsonData.site_info[0].will.down) {
            siteInfo.will.down[item.mark] = {...item, };
        }

        //  時刻表データ
        let timesheet = {};
        for (const item of jsonData.timesheet) {
            let ts = {};
            for (const key of ["status", "edit_time", "up_time", "title", "back_color", "text1", "text2", "text3", "cal_text", "double_line"]) {
                ts[key] = item[key];
            }
            ts.list = item.list.map(li => {
                let tsli = {};
                tsli.time = parseInt(li.time);
                for (const key of ["bus_left", "bus_right"]) {
                    tsli[key] = {};
                    tsli[key].num1 = li[key].num1 === "" ? [] : li[key].num1.split(".");
                    tsli[key].memo1 = li[key].memo1;
                    tsli[key].num2 = li[key].num2 === "" ? [] : li[key].num2.split(".");
                    tsli[key].memo2 = li[key].memo2;
                }
                tsli.train_left = li.train_left === "" ? [] : li.train_left.num1.split(".").map(num => {
                    let tr = {
                        num: num.match(/[0-9]{2}/)[0],
                        mark: /^[a-z]/.test(num) ? num.match(/^[a-z]/)[0] : "",
                        operate_day: /◆/.test(num),
                        change_time: /■/.test(num),
                    }
                    tr.will = tr.mark ? siteInfo.will.up[tr.mark] : siteInfo.will.up.default;
                    return tr;
                });
                tsli.train_right = li.train_right === "" ? [] : li.train_right.num1.split(".").map(num => {
                    let tr = {
                        num: num.match(/[0-9]{2}/)[0],
                        mark: /^[a-z]/.test(num) ? num.match(/^[a-z]/)[0] : "",
                        operate_day: /◆/.test(num),
                        change_time: /■/.test(num),
                    }
                    tr.will = tr.mark ? siteInfo.will.down[tr.mark] : siteInfo.will.down.default;
                    return tr;
                });
                return tsli;
            });
            timesheet[item.ts_id] = ts;
        }

        resolve({
            update:     jsonData.update,
            timesheet:  timesheet,
            calendar:   jsonData.calendar,
            site_info:  siteInfo,
        });
    });
}

function lookupTsId(parsedJsonData, month, day) {
    let m = parsedJsonData.calendar.find(m => parseInt(m.month) === month);
    if (m) {
        let d = m.list.find(d => parseInt(d.day) === day);
        if (d) {
            return d.ts_id;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

module.exports = { parseSchoolbusJson, lookupTsId };
