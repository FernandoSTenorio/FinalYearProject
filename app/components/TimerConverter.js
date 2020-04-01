import React from 'react';

    function pluralCheck (s) {
        if(s == 1){
            return 'ago';
        }else{
            return 's ago';
        }
    }

    //function to check timestamp ?? Function is not working yet, remember to check next week.
    const timeConverter = (timestamp) => {

        var  a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if(interval > 1){
            return interval+ ' year'+pluralCheck(interval);
        }
        var interval1 = Math.floor(seconds / 2592000);
        if(interval1 > 1){
            return interval1+ ' month'+ pluralCheck(interval1);
        }
        var interval2 = Math.floor(seconds / 86400);
        if(interval2 > 1){
            return interval2+ ' day'+pluralCheck(interval2);
        }
        var interval3 = Math.floor(seconds / 3600);
        if(interval3 > 1){
            return interval3 + ' hour'+ pluralCheck(interval3);
        }
        var interval4 = Math.floor(seconds / 60);
        if(interval4 > 1){
            return interval4 + ' minute'+ pluralCheck(interval4);
        }
        return Math.floor(seconds)+ ' second'+ pluralCheck(seconds);
    }

export default timeConverter;
  
