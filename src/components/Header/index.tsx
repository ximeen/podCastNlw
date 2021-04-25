import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from 'C:/Users/gabri/Downloads/aulas/projetonext/src/components/Header/styles.module.scss';

export function Header(){
  const currentDate = format(new Date(), 'EEEEEEE, d MMMM',{
    locale: ptBR,
  });

  return(
    <header className={styles .headerContainer} >
      <img src="/logo.svg" alt="Podcast"/>
      <p> 
        The best for you aways listen
      </p>
    <span> 
      {currentDate}
    </span>

    </header>
  )
}