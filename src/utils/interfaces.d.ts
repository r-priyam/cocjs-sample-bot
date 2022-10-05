export interface CommandFile {
    execute(): void;
    slashCommand: { name: string; toJSON(): any };
}

export interface DiscordEventFile {
    execute(...args: unknown[]): void;
    name: string;
}

export interface ClashEventFile {
    execute(...args: unknown[]): Promise<void>;
    filter(...args: unknown[]): boolean;
    name: string;
}
