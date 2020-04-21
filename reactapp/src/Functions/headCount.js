export default function headCount(temp) {
    if (temp != null && temp != []) {
        //console.log('je suis la =', temp)
        let tempcount = 0;
        for (var i = 0; i < temp.length; i++) {
            tempcount = tempcount + temp[i].quantity;
        }
        return tempcount;
    } else {
        //console.log('je suis ici =', temp)
        return 0;
    }
}