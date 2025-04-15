--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'WIN1251';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics_events (
    id integer NOT NULL,
    event_type character varying(50) NOT NULL,
    user_id integer,
    session_id character varying(255) NOT NULL,
    client_id character varying(255) NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.analytics_events OWNER TO postgres;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytics_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_events_id_seq OWNER TO postgres;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytics_events_id_seq OWNED BY public.analytics_events.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    total numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'processing'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category_id integer,
    image_url character varying(255),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_addresses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    city character varying(100) NOT NULL,
    street character varying(100) NOT NULL,
    house character varying(20) NOT NULL,
    apartment character varying(20),
    postal_code character varying(20),
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_addresses OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_addresses_id_seq OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_addresses_id_seq OWNED BY public.user_addresses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: analytics_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events ALTER COLUMN id SET DEFAULT nextval('public.analytics_events_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: user_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses ALTER COLUMN id SET DEFAULT nextval('public.user_addresses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytics_events (id, event_type, user_id, session_id, client_id, data, created_at) FROM stdin;
4	pageview	\N	PzyDRX3TnhWu4d_4YQw8K3v6CSr0uPtG	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:19.189+03
5	pageview	\N	PzyDRX3TnhWu4d_4YQw8K3v6CSr0uPtG	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:21.236+03
6	pageview	\N	PzyDRX3TnhWu4d_4YQw8K3v6CSr0uPtG	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "POST", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:26.992+03
7	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:27.135+03
8	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:28.967+03
9	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/stats", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:39.551+03
10	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/catalog", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:40.695+03
11	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:41.912+03
12	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/stats", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:44.358+03
13	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:46.207+03
14	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/cart", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:55:47.546+03
15	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/cart", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 00:57:43.056+03
1	pageview	1	WEv5QvjoMNeyV5Mq-2xDfBv_UVLEMITp	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-03-01 00:00:00+03
2	pageview	1	WEv5QvjoMNeyV5Mq-2xDfBv_UVLEMITp	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/stats", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-03-01 00:00:00+03
3	pageview	1	WEv5QvjoMNeyV5Mq-2xDfBv_UVLEMITp	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/logout", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-03-01 00:00:00+03
16	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/cart", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:03:43.643+03
17	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/stats", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:03:48.537+03
18	pageview	2	jR0ysctIJAm1e9AAIFrHEpS2ds-Zjvbc	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/logout", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:03:51.656+03
19	pageview	\N	Ey_s02oWjSXb4tLB1IhX0z1PXD22m0HR	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:03:51.669+03
20	pageview	\N	Ey_s02oWjSXb4tLB1IhX0z1PXD22m0HR	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:03:54.176+03
21	pageview	\N	Ey_s02oWjSXb4tLB1IhX0z1PXD22m0HR	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "POST", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:03:59.027+03
22	pageview	1	EWEvY_kgKkvShvdH_0cCQS_u00yMDaeT	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:03:59.179+03
23	pageview	1	EWEvY_kgKkvShvdH_0cCQS_u00yMDaeT	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:04:01.351+03
24	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:01.547+03
25	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:01.56+03
26	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:08.63+03
27	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:10.162+03
28	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:13.937+03
29	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:13.948+03
30	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:16.641+03
31	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/register", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:18.383+03
32	pageview	\N	Npy-S2z9HWTwkW7eCg8ZjMB3vJG-uJ5P	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/register", "method": "POST", "referrer": "http://localhost:3000/auth/register", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:46.836+03
33	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/auth/register", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:46.976+03
34	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/catalog", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:52.716+03
35	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart/add", "method": "POST", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:54.917+03
36	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart/add", "method": "POST", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:54.921+03
37	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart/add", "method": "POST", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:56.337+03
38	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart/add", "method": "POST", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:56.339+03
39	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:57.784+03
40	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/checkout", "method": "GET", "referrer": "http://localhost:3000/cart", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:10:59.846+03
41	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/checkout", "method": "POST", "referrer": "http://localhost:3000/checkout", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:01.187+03
42	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/checkout", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:02.65+03
43	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/orders", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:03.892+03
44	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/orders", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:06.111+03
45	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/orders", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:20.105+03
46	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/stats", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:27.303+03
47	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/catalog", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:41.232+03
48	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart/add", "method": "POST", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:43.148+03
49	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart/add", "method": "POST", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:43.151+03
50	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/cart", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:45.448+03
51	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/checkout", "method": "GET", "referrer": "http://localhost:3000/cart", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:46.79+03
52	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/checkout", "method": "POST", "referrer": "http://localhost:3000/checkout", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:48.249+03
53	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/checkout", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:49.804+03
54	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/stats", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:51.282+03
55	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/orders", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:11:52.556+03
56	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/orders", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:14:04.24+03
57	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/orders", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:15:33.463+03
58	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/catalog", "method": "GET", "referrer": "http://localhost:3000/stats", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:15:45.143+03
59	pageview	5	XJAbjD2XoCbfsgOPo4_oc4D7M_8ty9Ed	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:15:52.344+03
60	pageview	\N	b2Oi24guvBt64W2Q5yxgNiVof3ELRGuu	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:15:58.65+03
61	pageview	\N	b2Oi24guvBt64W2Q5yxgNiVof3ELRGuu	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:16:02.121+03
62	pageview	\N	yhrPcVWSMUNzFG6TvE82QJ0YItnBX2Ak	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:16:10.483+03
63	pageview	\N	yhrPcVWSMUNzFG6TvE82QJ0YItnBX2Ak	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/catalog", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:16:15.277+03
64	pageview	\N	yhrPcVWSMUNzFG6TvE82QJ0YItnBX2Ak	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:16:16.265+03
65	pageview	\N	yhrPcVWSMUNzFG6TvE82QJ0YItnBX2Ak	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/catalog", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:16:16.28+03
66	pageview	\N	yhrPcVWSMUNzFG6TvE82QJ0YItnBX2Ak	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:16:17.371+03
67	pageview	\N	tUxHlfyn-E6y4nvdBndKCC1kXFuP0N_r	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:16:37.354+03
68	pageview	\N	tUxHlfyn-E6y4nvdBndKCC1kXFuP0N_r	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:18:34.298+03
69	pageview	\N	tUxHlfyn-E6y4nvdBndKCC1kXFuP0N_r	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "POST", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:18:40.612+03
70	pageview	2	4BkFqMuydQy45vrUoLMJG_-14TjjewKB	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/profile", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:18:40.845+03
71	pageview	2	4BkFqMuydQy45vrUoLMJG_-14TjjewKB	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:18:44.525+03
72	pageview	2	4BkFqMuydQy45vrUoLMJG_-14TjjewKB	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/statslocalStorage.clear();void(0);", "method": "GET", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:21:46.594+03
73	pageview	\N	rEq8j5VlsTedtkcKSXvp6m9pEEzXISsn	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:23:06.898+03
74	pageview	\N	rEq8j5VlsTedtkcKSXvp6m9pEEzXISsn	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:23:06.913+03
75	pageview	\N	rEq8j5VlsTedtkcKSXvp6m9pEEzXISsn	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/profile", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:27:48.147+03
76	pageview	\N	rEq8j5VlsTedtkcKSXvp6m9pEEzXISsn	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/", "method": "GET", "referrer": "http://localhost:3000/auth/login", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:28:00.37+03
77	pageview	\N	rEq8j5VlsTedtkcKSXvp6m9pEEzXISsn	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/stats", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:28:07.735+03
78	pageview	\N	rEq8j5VlsTedtkcKSXvp6m9pEEzXISsn	fe821012-eba5-4275-9086-1849b23c14a7	{"ip": "::1", "url": "/auth/login", "method": "GET", "referrer": "http://localhost:3000/", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}	2025-04-15 01:28:07.755+03
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug) FROM stdin;
5	bathroom	bathroom
6	kitchen	kitchen
8	bedroom	bedroom
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
8	6	8	1	8900.00
9	6	7	2	2500.00
10	7	7	1	2500.00
11	8	8	1	8900.00
12	8	7	6	2500.00
13	9	10	1	2900.00
14	10	10	1	2900.00
15	10	8	1	8900.00
16	11	6	1	5600.00
17	11	7	1	2500.00
18	12	9	2	2900.00
19	13	9	1	2900.00
20	13	8	1	8900.00
21	13	7	1	2500.00
22	13	6	1	5600.00
23	14	10	2	2900.00
24	14	10	1	2900.00
25	14	10	1	2900.00
26	15	10	1	2900.00
27	15	9	1	2900.00
28	16	9	1	2900.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total, status, created_at) FROM stdin;
7	2	2500.00	completed	2025-04-12 12:06:21.383297
8	4	23900.00	completed	2025-04-12 12:15:09.029059
9	4	2900.00	completed	2025-04-12 12:15:32.906698
10	1	11800.00	completed	2025-04-12 12:17:04.977756
12	1	5800.00	completed	2025-04-12 13:14:00.443356
6	1	13900.00	completed	2025-03-10 09:30:00
13	1	19900.00	completed	2025-04-12 22:33:29.231509
11	1	8100.00	completed	2025-02-10 09:30:00
14	1	11600.00	completed	2025-04-14 22:48:47.600486
15	5	5800.00	completed	2025-02-10 09:30:00
16	5	2900.00	completed	2025-02-10 09:30:00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, category_id, image_url, created_at) FROM stdin;
6	6-Piece Modern Flatware Set	Pare cutlery is precision-engineered for balance and simplicity. The brushed stainless steel resists fingerprints, while the rounded handles provide a surprising grip. Dishwasher-safe and timeless enough for daily use or dinner parties.	5600.00	6	/images/pare.jpg	2025-04-12 11:14:07.130548
7	Eden - Elegant Ceramic Dinner Plate	The Eden plate redefines everyday dining with its sculpted rim and matte glaze. Whether serving gourmet meals or avocado toast, its uncluttered design lets your food shine. Chip-resistant and lightweight, yet impressively durable.	2500.00	6	/images/plate.jpg	2025-04-12 11:15:44.350742
8	Haven - Chunky Knit Cashmere-Blend Blanket	Wrap yourself in the Haven blanket, where comfort meets elegance. Handcrafted with ultra-soft cashmere and wool blend, its oversized knit design adds texture and warmth to your space. Drape it over a sofa or layer it on your bed for instant cozy luxury.	8900.00	8	/images/knit.jpg	2025-04-12 11:17:18.57779
9	LUMI - Elegant Ceramic Soap Dispenser	The LUMI soap dispenser blends minimalist design with a touch of luxury. Crafted from matte-finish ceramic with a delicate gold rim, it elevates any modern bathroom. Its smooth surface, premium pump, and neutral color scheme make it a timeless addition to your home.	2900.00	5	/images/soap.jpg	2025-04-12 11:18:26.178644
10	PURE - Tall Ceramic Bathroom Cup	The PURE toothbrush holder combines functionality with understated elegance. Its tall design (7 inches) keeps brushes upright and organized, while the matte ceramic and gold-trimmed rim add a refined touch. No clutter - just clean, sophisticated storage.	2900.00	5	/images/holder.jpg	2025-04-12 12:09:30.663964
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_addresses (id, user_id, city, street, house, apartment, postal_code, is_default, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, created_at) FROM stdin;
1	�������	zhenechka-03@bk.ru	$2b$10$FBMTl0K8n2XozPJ4uES.NO8JJ3z.jgvf9DpspH9EemPiqdtZbaY1y	2025-04-12 00:54:26.234769
2	����	eda@gmail.com	$2b$10$tP.bo4eFNmgV5NqIXkbeWOhxcXASw3m3D2dvHm8zx9GVdv.biqdtW	2025-04-12 00:55:32.389817
3	������	par@mail	$2b$10$wPTC1ApLumLdnZYmL/yIK.mNNVbpw9JQcxbx5KKs3yimYj50YsyXO	2025-04-12 01:34:57.010918
4	john_doe	gnglrsn@ntn	$2b$10$4vN/9cTqXBRMRkoU7xdW3euNUbgTzBvpssHGKERsWDaOQa.jFu0Y2	2025-04-12 12:14:51.164327
5	Anastasia	nas@gmail.com	$2b$10$F5whrw8/AJ9owKU/ggHNRuGnzRwaMrxpgLngpH7t/GRsyck9RKfLi	2025-04-15 01:10:46.964484
\.


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_events_id_seq', 78, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 28, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 16, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 10, true);


--
-- Name: user_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_addresses_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_analytics_events_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_events_client_id ON public.analytics_events USING btree (client_id);


--
-- Name: idx_analytics_events_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events USING btree (created_at);


--
-- Name: analytics_events analytics_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

