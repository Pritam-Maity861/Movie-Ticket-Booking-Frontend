const timeFormat=(minutes: number)=>{
    const hours=Math.floor(minutes/60);
    const minutesRemaindder=minutes%60;
    return `${hours}h ${minutesRemaindder}m`
}

export default timeFormat;