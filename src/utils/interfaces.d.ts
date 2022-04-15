export interface CommandFile {
    slashCommand: { name: string; toJSON: () => any };
    execute: () => void;
}

export interface DiscordEventFile {
    name: string;
    execute: (...args: unknown[]) => void;
}

export interface ClashEventFile {
    name: string;
    filter: (...args: unknown[]) => boolean;
    execute: (...args: unknown[]) => void;
}
