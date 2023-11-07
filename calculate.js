function calculate ({
    width,
    height
}) {
    if (width) {
        return (width * (100 / 375)).toFixed(2) + "vw";
    }

    if (height) {
        return (height * (100 / 724)).toFixed(2) + "vh";
    }
}

console.log(calculate({ height: 43 }));
console.log(calculate({ width: 23 }));
console.log(calculate({ height: 0 }));
console.log(calculate({ width: 22 }));


var data = [
    { type: '1', year: '1971' },
    { type: '1', year: '1956' },
    { type: '2', year: '1988' },
    { type: '1', year: '1989' },
];

console.log(data.sort(function (a, b) {
    const aCount = a.type == "1" ? 0 : 0;
    const bCount = b.type == "1" ? 0 : 1;
    console.log(aCount, bCount, a.year, b.year);
    return aCount - bCount || a.year - b.year;
}));

// 降序的结果
// {type: '1', year: '1956'}
// {type: '1', year: '1971'}
// {type: '1', year: '1989'}
// {type: '2', year: '1988'}


// async await
const aww = () => {
    return 'aww';
}
function te () {
    const a =  aww();
    console.log('1',a)
    return a;
}
const b = te()
console.log('2',b)


// callback
const aww2 = (cb) => {
    cb('aw2');
}

function te2 (cb2) {
    const cb = (a) => {
        console.log('12',a);
        cb2('34' + a);
    };
    aww2(cb)
}

te2((b) => console.log(b))
