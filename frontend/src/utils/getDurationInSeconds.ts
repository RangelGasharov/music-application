export function getDurationInSeconds(duration: string): number {
    const [hh = "0", mm = "0", ssWithMs = "0"] = duration.split(":");
    const [sec = "0", msRaw = "0"] = ssWithMs.split(".");

    const hours = parseInt(hh, 10);
    const minutes = parseInt(mm, 10);
    const seconds = parseInt(sec, 10);

    const msStr = msRaw.substring(0, 3).padEnd(3, "0");
    const milliseconds = parseInt(msStr, 10);

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}