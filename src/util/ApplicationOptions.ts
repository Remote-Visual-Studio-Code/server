import bodyparser from 'body-parser';
import express, { Application } from 'express';
import cors from 'cors';

type Options = {
    url_parsers: { url_encoded: boolean; json: boolean };
    cors_policy: { origin: string };
    view_engine: { engine: string; folder: string };
    public: { folder: string };
    routers: [string, any][];
    pages: any;
};

export default class ApplicationOptions {
    private app: Application;

    private options: Options;

    constructor(app: Application, options: Options) {
        this.app = app;
        this.options = options;

        this.applyOptions();
    }

    private applyOptions(): void {
        const applyUrlParsers = (): void => {
            if (this.options.url_parsers.url_encoded) {
                this.app.use(bodyparser.urlencoded({ extended: false }));
            }

            if (this.options.url_parsers.json) {
                this.app.use(bodyparser.json());
            }
        };

        const applyCorsPolicy = (): void => {
            this.app.use(
                cors({
                    origin: this.options.cors_policy.origin,
                }),
            );
        };

        const applyViewEngine = (): void => {
            this.app.set('view engine', this.options.view_engine.engine);
            this.app.set('views', this.options.view_engine.folder);
        };

        const applyPublicDirs = (): void => {
            this.app.use(express.static(this.options.public.folder));
        };

        const applyAppRouters = (): void => {
            this.options.routers.forEach(([path, router]) => {
                this.app.use(path, router);
            });
        };

        const enableSitePages = (): void => {
            this.options.pages(this.app);
        };

        applyUrlParsers();
        applyCorsPolicy();
        applyViewEngine();
        applyPublicDirs();
        applyAppRouters();
        enableSitePages();
    }
}
