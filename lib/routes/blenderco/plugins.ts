import { Route } from '@/types';
import cache from '@/utils/cache';
import got from '@/utils/got';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';

// Define handler first
const handler = async (ctx) => {
    const baseUrl = 'https://blenderco.cn';
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    const response = await got(baseUrl, {
        headers
    });

    const $ = load(response.data);
    
    const items = $('.post.grid.grid-zz').map((_, post) => {
        const $post = $(post);
        const $title = $post.find('h3 a');
        const $img = $post.find('img.thumb');
        
        return {
            title: $title.text().trim(),
            link: $title.attr('href'),
            description: `<img src="${$img.attr('data-src') || $img.attr('src')}" /><br>${$title.text().trim()}`,
            pubDate: parseDate(new Date().toISOString()),
        };
    }).get();

    return {
        title: 'Blender中文社区插件更新',
        link: baseUrl,
        description: 'Blender中文社区的最新插件更新',
        language: 'zh-cn',
        item: items,
    };
};

// Then define the route object
export const route: Route = {
    path: '/plugins',
    categories: ['program-update'],
    example: '/blenderco/plugins',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['blenderco.cn/plugins'],
            target: '/plugins',
        },
    ],
    name: 'Blender插件更新',
    maintainers: ['Jaaayden'],
    handler,
};