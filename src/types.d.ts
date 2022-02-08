
type Option = {
    type: 'text';
    text: string;
    fontFamily?: string;
    fontWeight?: string|number;
    fontSize?: number;
    chartSet?: string[];
}|{
    type: 'image';
    imageSrc: string;
    scale?: number;
    chartSet?: string[];
}
interface Window {
    DEBUG: boolean
}
declare const DEBUG: boolean;
// type WordCloudOptionStrict = Required<WordCloudOption>

