import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


/**
* Check the the user has permissions to access either camera and the camera roll
*/
 export async function   _checkPermission(){
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        var camera = status;
        const {statusRoll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        var cameraRoll = statusRoll;

        return (camera, cameraRoll);
    }

    /**
     * return a sequence of random letters and numbers, to allow us to get a completly random string
     */
 export function s4 () {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16).substring(1);
    }

 /**
     * This Function creates an image unique id every time a post is created
     * it returns a sequance of random numbers.
     */   
export function  uniqueId (){
        return s4() + s4() + '-' + s4() + '-' + s4() +'-' +
        s4() + s4() + '-' + s4() + '-' + s4();
    }