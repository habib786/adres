import Head from "next/head";
import styles from "../styles/Home.module.css";
import TopNav from '../components/top_nav';
import EmployeeTable from '../components/employee_table';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Adres App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Container>
                    <TopNav></TopNav>
                    <Divider variant="middle" style={{width:'100%', margin: '10px 0'}}/>
                    <EmployeeTable></EmployeeTable>
                </Container> 
            </main>
        </div>
    );
}