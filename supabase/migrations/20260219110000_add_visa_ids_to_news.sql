alter table news_articles add column visa_ids uuid[] default '{}';
create index idx_news_articles_visa_ids on news_articles using gin (visa_ids);
