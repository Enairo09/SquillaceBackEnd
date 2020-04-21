
export default function formatDate(date) {
    // console.log(date)
    const birthday = new Date(date);
    const date1 = birthday.getDate();
    const date2 = birthday.getMonth() + 1;
    const date3 = birthday.getFullYear();
    if (date1 < 10 && date2 < 10) {
        return `0${date1}/0${date2}/${date3}`;
    } else if (date1 < 10) {
        return `0${date1}/${date2}/${date3}`;
    } else if (date2 < 10) {
        return `${date1}/0${date2}/${date3}`;
    } else {
        return `${date1}/${date2}/${date3}`;
    }
}