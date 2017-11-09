module.exports = {
    createDataByType(arr){
        switch (arr[0]){
            case 'int':
                return this.dealDataNumberRange(arr, 1);
                break;
            case 'float':
                return this.dealDataNumberRange(arr, 0);
                break;
            case 'string':
                return this.dealDataString(arr);
                break;
            case 'bool':
                return this.dealDataBool(arr);
                break;
            case 'url':
                return this.dealDataString(arr);
                break;
            default:
                return null;
        }
    },
    dealDataNumberRange(arr, isInt){
        if(arr && arr.length == 3){
            if(isInt){
                return Math.floor(Number(arr[1])+Math.random()*(Number(arr[2])-Number(arr[1])));
            }else{
                return Number(arr[1])+Math.random()*(Number(arr[2])-Number(arr[1]));
            }
        }else{
            return Number(arr[1]);
        }

    },
    dealDataString(arr){
        if(arr && arr.length >= 3){
            let index = 1 + Math.floor(Math.random()* (arr.length - 1));
            return arr[index];
        }else if(arr && arr.length == 2){
            return arr[1];
        }else{
            return null;
        }
    },
    dealDataBool(arr){
        if(arr && arr.length >= 2){
            return Boolean(arr[1]);
        }else{
            return null;
        }
    }
}