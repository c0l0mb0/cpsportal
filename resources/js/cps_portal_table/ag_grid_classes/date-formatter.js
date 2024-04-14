export default function DateFormatter(params) {
    if (params.value !== undefined && params.value !== null) {
        let dateAsString = params.value;
        let dateParts = dateAsString.split('-');
        return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    }
}
