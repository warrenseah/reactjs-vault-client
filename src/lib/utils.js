export const convertToDateTime = (unix) => {
    const date = new Date(unix * 1000);
    return date.toISOString();
};

export const haveTimePast = unix => {
    const now = Math.floor(Date.now() / 1000);
    if(now > unix) {
        return true;
    } else {
        return false;
    }
};

export const truncateTo2DC = stringNum => {
    return stringNum.slice(0, (stringNum.indexOf("."))+3); //With 3 exposing the hundredths place
};