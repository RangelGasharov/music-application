export function formatDuration(duration: string): string {
    const parts = duration.split(":");

    if (parts.length < 3) {
        return "0:00";
    }

    const minutes = parseInt(parts[1], 10);
    const seconds = Math.floor(parseFloat(parts[2]));

    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${minutes}:${formattedSeconds}`;
}