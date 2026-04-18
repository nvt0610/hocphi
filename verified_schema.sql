--
-- PostgreSQL database dump
--

\restrict 8AAP3Ujf1rjNtacW1DhIgFpdYkpSWyuB4Lb2jd38kFwY2kMDGHtCgeEDYYRBJTR

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: class_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.class_schedules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    class_id uuid NOT NULL,
    day_of_week integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT class_schedules_day_of_week_check CHECK (((day_of_week >= 2) AND (day_of_week <= 8)))
);


--
-- Name: classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    class_name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    monthly_fee numeric(10,2) DEFAULT '0'::numeric NOT NULL
);


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    class_id uuid NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "CHK_fa5c78e8dda4534d2156db2277" CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying(100) NOT NULL,
    gender character varying(10),
    date_of_birth date,
    address text,
    phone_number character varying(15),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tuition_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tuition_records (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    amount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    payment_date timestamp with time zone,
    status character varying(20) DEFAULT 'Unpaid'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    enrollment_id uuid,
    billing_month character varying(7),
    content text,
    CONSTRAINT "CHK_5cc624e988c90600216121360c" CHECK (((status)::text = ANY ((ARRAY['Paid'::character varying, 'Unpaid'::character varying])::text[])))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(100),
    role character varying(20) DEFAULT 'staff'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'staff'::character varying])::text[])))
);


--
-- Name: enrollments UQ_c9010ea626bec182e178a8ce679; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "UQ_c9010ea626bec182e178a8ce679" UNIQUE (student_id, class_id);


--
-- Name: class_schedules class_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_pkey PRIMARY KEY (id);


--
-- Name: classes classes_class_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_class_name_key UNIQUE (class_name);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: tuition_records tuition_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tuition_records
    ADD CONSTRAINT tuition_records_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_enrollments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enrollments_status ON public.enrollments USING btree (status);


--
-- Name: idx_schedules_class_day; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schedules_class_day ON public.class_schedules USING btree (class_id, day_of_week);


--
-- Name: idx_students_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_students_name ON public.students USING btree (full_name);


--
-- Name: idx_tuition_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tuition_student ON public.tuition_records USING btree (student_id);


--
-- Name: tuition_records FK_12f40a5d8e40c1b39c7f03926d4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tuition_records
    ADD CONSTRAINT "FK_12f40a5d8e40c1b39c7f03926d4" FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: enrollments FK_307813fe255896d6ebf3e6cd55c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c" FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: class_schedules FK_8311cc83d9350de70f2a77e8c5e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT "FK_8311cc83d9350de70f2a77e8c5e" FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: tuition_records FK_f6562ede7ad9ee7b2bd31d98ee3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tuition_records
    ADD CONSTRAINT "FK_f6562ede7ad9ee7b2bd31d98ee3" FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE SET NULL;


--
-- Name: enrollments FK_f8b7b5b30f3d3c3c8b81068cd79; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "FK_f8b7b5b30f3d3c3c8b81068cd79" FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 8AAP3Ujf1rjNtacW1DhIgFpdYkpSWyuB4Lb2jd38kFwY2kMDGHtCgeEDYYRBJTR

