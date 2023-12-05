import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './post.entity';
import PostSearchResult from './types/postSearchResponse.interface';
import PostSearchBody from './types/postSearchBody.interface';


@Injectable()
export default class PostsSearchService{
    index = 'posts'

    constructor(
        private readonly elasticssearchService: ElasticsearchService
    ){}

    async indexPost(post: Post){
        return this.elasticssearchService.index<PostSearchBody>({
            index: this.index,
            body: {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.author.id
            },
        });
    }

    async search(text: string, offset?: number, limit?: number){
        const body  = await this.elasticssearchService.search<PostSearchResult>({
            index: this.index,
            from: offset,
            size: limit,
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fields: ['title', 'content']
                    }
                },
                sort: {
                    id: {
                        order: 'asc'
                    }
                }
            }
        })
        const count = body.hits.total;
        const hits = body.hits.hits;
        const results = hits.map((item) => item._source);
        return {count, results}
    }
}