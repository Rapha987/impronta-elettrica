create table if not exists quote_requests (
  id           text primary key,
  name         text not null,
  phone        text not null,
  zone         text not null,
  job_type     text not null,
  description  text not null,
  photos_json  text not null default '[]',
  status       text not null default 'nuova',
  created_at   timestamptz not null default now()
);

create index if not exists quote_requests_created_at_idx
  on quote_requests (created_at desc);

create index if not exists quote_requests_status_idx
  on quote_requests (status);

insert into quote_requests (id, name, phone, zone, job_type, description, photos_json, status, created_at)
values
  (
    'IE-DEMO1',
    'Marco L.',
    '333 120 4481',
    'Andria',
    'illuminazione',
    'Vorrei aggiungere 6 faretti LED nel soggiorno e una striscia perimetrale sul controsoffitto. Il locale è circa 25 mq.',
    '["/works/soggiorno.jpg"]',
    'nuova',
    now() - interval '18 minutes'
  ),
  (
    'IE-DEMO2',
    'Lucia P.',
    '347 882 0193',
    'Corato',
    'quadro',
    'Quadro elettrico da mettere a norma dopo ristrutturazione. Casa indipendente, 2 piani.',
    '["/works/quadro.jpg"]',
    'vista',
    now() - interval '5 hours'
  ),
  (
    'IE-DEMO3',
    'Giovanni R.',
    '320 554 7710',
    'Barletta',
    'esterni',
    'Illuminazione ingresso e facciata. Vorrei faretti caldi tipo quelli della foto, con accensione crepuscolare.',
    '["/works/esterno.jpg","/works/soggiorno.jpg"]',
    'contattata',
    now() - interval '2 days'
  )
on conflict (id) do nothing;
