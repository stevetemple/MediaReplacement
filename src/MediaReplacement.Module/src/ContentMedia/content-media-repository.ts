import { type UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { ContentMediaDataSource, type ContentMediaSource } from "./content-media.server.data-source";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";


export class ContentMediaRespository extends UmbRepositoryBase {
    #contentMediaSource: ContentMediaSource;

    constructor(host: UmbControllerHost) {
        super(host);
        this.#contentMediaSource = new ContentMediaDataSource();
    }

    async getMediaForContent(id: {unique: string}) : Promise<any> {
        return this.#contentMediaSource.getMediaForContent({id : id});
    }
}

