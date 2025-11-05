// eslint-disable-next-line no-unused-vars
import React, { useEffect, useCallback } from 'react';

// === DADOS E CONFIGURAÇÕES DO PROJETO (ALTAMENTE CONFIGURÁVEL) ===

// TODO: SUBSTITUA o link do WhatsApp (mantenha a codificação da mensagem)
const WHATSAPP_LINK_BASE = "https://wa.me/5519982105888?text=Oi%2C%20quero%20saber%20mais%20sobre%20o%20curso%20de%20Terapias%20Injet%C3%A1veis%20em%20SP%20(04-05%2F12).";

// TODO: Configure os parâmetros UTM para rastreamento de anúncios
const UTM_PARAMS = "?utm_source=instagram&utm_medium=cpc&utm_campaign=imersao-hof-2025&utm_content=stories-reels-mobile";
const WHATSAPP_LINK = WHATSAPP_LINK_BASE + UTM_PARAMS;

// TODO: Link da Política de Privacidade (placeholder)
const PRIVACY_POLICY_LINK = "#politica-de-privacidade"; 

const projectData = {
  title: "Imersão Terapias Injetáveis para HOF – 04 e 05/12 (São Paulo)",
  subtitle: "Para cirurgiões-dentistas, médicos e biomédicos que querem potencializar resultados na harmonização facial.",
  heroSubheadline: "Potencialize seus resultados na harmonização facial com protocolos seguros e integrativos.",
  value: "R$ 1.700 em até 10x",
  enrollment: "matrícula R$ 260",
  dateLabel: "04-05/12",
  agenda: "São Paulo – 04 e 05/12 • 9h às 18h",
  instructors: [
    { name: "Dra. Paola Baldo", cro: "CROSP 88555" },
    { name: "Dra. Grace Insardi", cro: "CRO 84169" },
  ],
  differentials: [
    "Protocolos seguros e integrativos aplicados à HOF",
    "Prática guiada + materiais de suporte",
    "Turma reduzida • Certificado",
    "Suporte pré e pós-curso",
  ],
  learnings: [
    "Seleção de terapias injetáveis de suporte (indicações/contraindicações)",
    "Protocolo pré e pós-procedimento para otimizar cicatrização e resultado",
    "Combinações seguras com técnicas de HOF",
    "Manejo de intercorrências e checklist de biossegurança",
    "Documentação e padronização de protocolos",
  ],
  faq: [
    { q: "Emite certificado?", a: "Sim." },
    { q: "Parcelamento?", a: "Sim, até 10x." },
    { q: "Como reservo?", a: "Fale com a equipe no WhatsApp." },
  ],
  testimonialPlaceholders: [
    "\"Melhor curso de Terapias Injetáveis que já fiz! Conteúdo prático e aplicável. As Dras. Paola e Grace são incríveis.\"",
    "\"A atenção pós-curso é o grande diferencial. Protocolos que realmente funcionam e me deram mais segurança na prática clínica.\"",
    "\"Turma reduzida foi essencial para a prática. Saí da imersão com total domínio das técnicas integrativas.\"",
  ],
  legalNotice: "Curso para profissionais habilitados (CD, médicos e biomédicos). Emissão de certificado. Sujeito a vagas.",
};

// --- Funções de Rastreamento (Pixel/GTM) ---

const trackConversion = (ctaName) => {
  // Dispara o evento de conversão para o Google Tag Manager (GTM)
  // TODO: Certifique-se de que o GTM/dataLayer esteja configurado no seu index.html
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "wa_cta_click",
      cta_name: ctaName,
    });
  }
  // Log para depuração no console
  console.log(`cta_whatsapp: ${ctaName}`);
};

// --- Componentes Reutilizáveis (Para manter o código limpo) ---

const CTAButton = ({ text, style = {}, ctaName, variation = 1, ...props }) => {
  const isPrimary = variation === 1; // Falar no WhatsApp
  const finalStyle = {
    ...styles.ctaButton,
    ...(isPrimary ? styles.ctaPrimary : styles.ctaSecondary),
    ...style
  };

  const handleClick = (e) => {
    e.preventDefault();
    trackConversion(ctaName);
    window.location.href = props.href;
  };

  return (
    <a
      href={props.href}
      style={finalStyle}
      onClick={handleClick}
      aria-label={text}
      role="button"
      {...props}
    >
      {text}
    </a>
  );
};

const Section = ({ id, title, children, style = {} }) => (
  <section id={id} style={{ ...styles.section, ...style }}>
    <div style={styles.container}>
      {title && <h2 style={styles.sectionTitle}>{title}</h2>}
      {children}
    </div>
  </section>
);

const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Componente Principal da Landing Page ---

function App() {
  // Efeito para injetar Meta Tags e JSON-LD no Head
  useEffect(() => {
    const metaTags = [
      // SEO/Desempenho: Meta Description
      { name: "description", content: projectData.heroSubheadline.substring(0, 160) },
      // Open Graph/Twitter Cards
      { property: "og:title", content: projectData.title },
      { property: "og:description", content: projectData.heroSubheadline },
      // TODO: Substitua pelo URL da imagem otimizada para anúncios (9:16)
      { property: "og:image", content: "https://via.placeholder.com/600x1080?text=Imersao+PaolaGrace" }, 
      { property: "og:url", content: window.location.href },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: projectData.title },
      { name: "twitter:description", content: projectData.heroSubheadline },
      // TODO: Substitua pelo URL da imagem otimizada para anúncios (9:16)
      { name: "twitter:image", content: "https://via.placeholder.com/600x1080?text=Imersao+PaolaGrace" },
    ];

    metaTags.forEach(tagData => {
      const tag = document.createElement('meta');
      Object.entries(tagData).forEach(([key, value]) => tag.setAttribute(key, value));
      document.head.appendChild(tag);
    });

    // Título da página
    document.title = projectData.title;

    // Canonical URL (ajusta se tiver domínios diferentes)
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href.split('?')[0]);
    document.head.appendChild(canonical);

    // JSON-LD (Schema.org/Event)
    const eventSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": projectData.title,
      "startDate": "2025-12-04T09:00:00-03:00",
      "endDate": "2025-12-05T18:00:00-03:00",
      "location": {
        "@type": "Place",
        "name": "São Paulo",
        // TODO: Substitua pelo endereço completo (para melhor SEO local)
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua Exemplo, 123", 
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "addressCountry": "BR"
        }
      },
      "image": "https://via.placeholder.com/600x1080?text=Imersao+PaolaGrace", // Reuso da imagem OG
      "description": projectData.heroSubheadline,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "organizer": {
        "@type": "Person",
        "name": "Dra. Paola Baldo",
        "url": WHATSAPP_LINK
      },
      "offers": {
        "@type": "Offer",
        "price": "1700.00",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "url": WHATSAPP_LINK
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(eventSchema);
    document.head.appendChild(script);

    // Favicon (Genérico)
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💉</text></svg>';
    document.head.appendChild(favicon);

  }, []);

  return (
    <div style={{ ...styles.body, overflowX: 'hidden' }}>

      {/* 1. Header Fixo */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          {/* TODO: Substitua pelo seu logo/nome do projeto (Ex: PaolaGrace) */}
          
          <CTAButton
            text="Falar no WhatsApp"
            href={WHATSAPP_LINK}
            ctaName="header_fixo"
            style={styles.headerCta}
          />
        </div>
      </header>

      <main style={{ paddingTop: '14px' }}>
        

        {/* 2. Seção Hero */}
        <Section id="hero" style={styles.heroSection}>
          <div style={styles.heroContent}>
            <span style={styles.dateBadge}>{projectData.dateLabel}</span>
            <h1 style={styles.heroTitle}>{projectData.title}</h1>
            <p style={styles.heroSubtitle}>{projectData.heroSubheadline}</p>
            <div style={{
  marginTop: '12px',
  marginBottom: '28px',   // adicione esta linha
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,.25)',
  border: '1px solid rgba(255,255,255,.12)',
  background: '#0F203C'
}}>
<div style={{
  marginTop: '12px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,.25)',
  border: '1px solid rgba(255,255,255,.12)',
  width: '100%',
  maxWidth: 300,
  marginLeft: 'auto',
  marginRight: 'auto',
  background: 'transparent'
}}>
  <video
    autoPlay
    muted
    loop
    playsInline
    controls
    preload="auto"
    style={{
      width: '100%',
      height: 'auto',
      aspectRatio: '9 / 16',
      display: 'block'
    }}
    aria-label="Vídeo da imersão"
  >
    <source src="/video-lp.mp4" type="video/mp4" />
    Seu navegador não suportou este vídeo.
  </video>
</div>

</div>


            <div style={styles.priceBox}>
              <p style={styles.priceValue}>
                {projectData.value}
              </p>
              <p style={styles.priceEnrollment}>+ {projectData.enrollment}</p>
              <p style={styles.priceDisclaimer}>Vagas limitadas</p>
            </div>

            <CTAButton
              text="Quero garantir minha vaga"
              href={WHATSAPP_LINK}
              ctaName="hero_principal"
              variation={2}
              style={styles.ctaHero}
            />



            <p style={styles.targetAudience}>{projectData.subtitle}</p>
          </div>
        </Section>

        {/* 3. Seção Diferenciais */}
        <Section id="diferenciais" title="Por que esta imersão?">
          <ul style={styles.list}>
            {projectData.differentials.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <IconCheck style={styles.listIcon} width="20" height="20" />
                <span style={styles.listText}>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. Seção Conteúdo Programático */}
        <Section id="conteudo" title="O que você vai aprender">
          <ul style={styles.list}>
            {projectData.learnings.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <IconCheck style={styles.listIcon} width="20" height="20" />
                <span style={styles.listText}>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 5. Seção Instrutoras */}
        <Section id="instrutoras" title="Quem ministra" style={styles.instructorsSection}>
          <p style={styles.instructorsIntro}>
            Duas referências na área unidas para entregar a você os protocolos mais avançados e seguros em Terapias Injetáveis.
          </p>
          <div style={styles.instructorsGrid}>
            {projectData.instructors.map((instructor, index) => (
              <div key={index} style={styles.instructorCard}>
                {/* TODO: Substitua pelos URLs das fotos das instrutoras (círculo) */}
                <img
                  src={`https://via.placeholder.com/150/0F203C/FFFFFF?text=${instructor.name.split(' ')[2]}`}
                  alt={`Foto da ${instructor.name}`}
                  style={styles.instructorImage}
                />
                <h3 style={styles.instructorName}>{instructor.name}</h3>
                <p style={styles.instructorCro}>{instructor.cro}</p>
              </div>
            ))}
          </div>
        </Section>
        
        {/* 6. Seção Depoimentos */}
        <Section id="depoimentos" title="O que dizem sobre nós">
          <div style={styles.testimonialsGrid}>
            {projectData.testimonialPlaceholders.map((text, index) => (
              <blockquote key={index} style={styles.testimonialCard} aria-label="Depoimento de aluna">
                <span style={styles.quoteIcon}>“</span>
                {text}
              </blockquote>
            ))}
          </div>
        </Section>

        {/* 7. Seção Local e Agenda */}
        <Section id="agenda" title="Quando e onde">
          <p style={styles.agendaText}>{projectData.agenda}</p>
          <div style={styles.mapPlaceholder}>
            {/* TODO: Substitua pelo seu iframe do Google Maps ou um mapa estático da região. */}
            <p>Mapa do local da imersão em São Paulo (A ser inserido)</p>
            <a 
                href="https://maps.app.goo.gl/exemplo" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.mapLink}
            >
                Ver no Google Maps
            </a>
          </div>
        </Section>

        {/* 8. Seção FAQ */}
        <Section id="faq" title="Perguntas frequentes">
          <div style={styles.faqList}>
            {projectData.faq.map((item, index) => (
              <details key={index} style={styles.faqItem}>
                <summary style={styles.faqQuestion}>{item.q}</summary>
                <p style={styles.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* 9. CTA Final Grande */}
        <Section id="final-cta" title="Garanta sua vaga" style={styles.finalCtaSection}>
          <p style={styles.finalCtaText}>
            Não perca a chance de transformar sua prática clínica com protocolos injetáveis de ponta. **Turmas reduzidas** garantem o máximo de aproveitamento e prática guiada.
          </p>
          <CTAButton
            text="Falar no WhatsApp"
            href={WHATSAPP_LINK}
            ctaName="cta_final"
            style={styles.ctaFinal}
          />
          <p style={styles.priceDisclaimerSmall}>Restam poucas vagas! Garanta a sua agora.</p>
        </Section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <p style={styles.footerText}>
            {projectData.legalNotice}
          </p>
          <a href={PRIVACY_POLICY_LINK} style={styles.footerLink}>Política de Privacidade</a>
          <p style={styles.copyright}>© {new Date().getFullYear()} PaolaGrace. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* 4. Botão Flutuante do WhatsApp */}
      <CTAButton
        text="WhatsApp"
        href={WHATSAPP_LINK}
        ctaName="botao_flutuante"
        style={styles.floatingCta}
        variation={1} // Primário
        aria-label="Fale conosco no WhatsApp"
      >
        <svg style={styles.whatsappIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 2C6.586 2 2.115 6.467 2.115 11.908c0 1.838.487 3.593 1.411 5.122L2.012 22.18l4.456-1.168c1.472.802 3.142 1.226 4.963 1.226 5.446 0 9.916-4.471 9.916-9.918C21.347 6.467 16.878 2 12.031 2zM17.062 15.657c-.15.405-.884.725-1.218.824-.316.09-.691.134-1.066.045-.291-.072-.676-.234-1.173-.424-.552-.22-.92-.358-1.214-.469-.294-.112-.663-.298-1.02-.497-.36-.2-.673-.422-.977-.665-.3-.245-.605-.536-.913-.867-.31-.33-.615-.718-.894-1.127-.28-.408-.506-.87-.696-1.393-.189-.523-.298-1.107-.354-1.722-.055-.613.11-1.196.347-1.685.235-.488.59-.877 1.056-1.144.464-.266.974-.383 1.48-.383.189 0 .412.03.66.03.245.006.452.006.674.006.223 0 .46-.075.666.455.207.53.682 1.76 1.042 2.585.36.825.617 1.09.707 1.21.09.117.15.228.257.43.108.2.195.422.28.613.085.19.16.417.202.666.042.248.04.5.01.76-.03.26-.08.52-.16.78-.08.26-.17.51-.28.75s-.24.49-.37.71s-.29.41-.46.59c-.16.18-.36.35-.58.5s-.46.33-.71.49z"/>
        </svg>
      </CTAButton>
      
      {/* CSS Crítico Inline (Mobile First 9:16) */}
      <style>{`
  /* Reset básico */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  /* Garante largura total e elimina rolagem lateral */
  html, body, #root { width: 100%; height: 100%; overflow-x: hidden; }

  /* Fundo escuro global */
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
    line-height: 1.6; 
    color: #fff; 
    background-color: #0F203C;
  }

  /* Container usado nas sections e footer */
  .container {
      max-width: 90%;
      margin: 0 auto;
      padding: 0 1rem;
  }
`}</style>

    </div>
  );
}

// === CSS-in-JS (Objetos de Estilo) ===

// Cores
const colors = {
  primary: '#0F203C', // Azul Marinho Sóbrio (Fundo/Texto)
  secondary: '#FFD700', // Dourado (Detalhes/Ênfase)
  white: '#FFFFFF',
  text: '#333333',
  lightGray: '#F4F7F6',
  darkOverlay: 'rgba(0, 0, 0, 0.4)',
};

// Estilos Responsivos (Mobile First)
const styles = {
body: {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'transparent',
},

  container: {
    maxWidth: '90%',
    margin: '0 auto',
    padding: '0 1rem',
  },
  
  // --- Header Fixo ---
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: colors.primary,
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    maxWidth: '600px', // Limita a largura em telas maiores para foco mobile
    margin: '0 auto',
  },
  logo: {
    color: colors.white,
    fontSize: '1.2rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  headerCta: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    backgroundColor: colors.secondary,
    color: colors.primary,
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  // --- Seção Hero ---
  heroSection: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingTop: '96px', // Espaço para o header fixo
    paddingBottom: '2rem',
    minHeight: 'calc(100vh - 50px)', // Ocupa a maior parte da tela mobile
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(${colors.darkOverlay}, ${colors.darkOverlay}), url("https://via.placeholder.com/600x1080/0F203C/FFFFFF?text=Seu+Video+de+Fundo+Aqui")`, // TODO: Substitua pelo URL da imagem de fundo/mockup
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    textAlign: 'center',
  },
  heroContent: {
    padding: '1rem 0',
    maxWidth: '90%',
    margin: '0 auto',
  },
  dateBadge: {
    display: 'inline-block',
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    lineHeight: '1.2',
    marginBottom: '0.75rem',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    opacity: 0.9,
  },
  priceBox: {
    backgroundColor: colors.white,
    color: colors.primary,
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  priceValue: {
    fontSize: '1.5rem',
    fontWeight: '900',
    lineHeight: '1.1',
    color: colors.primary,
  },
  priceEnrollment: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: colors.text,
    marginTop: '0.2rem',
  },
  priceDisclaimer: {
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    color: colors.text,
    opacity: 0.7,
  },
  targetAudience: {
    fontSize: '0.9rem',
    marginTop: '1.5rem',
    opacity: 0.7,
    fontStyle: 'italic',
  },

  // --- CTA Geral ---
  ctaButton: {
    display: 'block',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '12px',
    transition: 'background-color 0.3s, transform 0.1s',
    cursor: 'pointer',
    width: '100%',
    margin: '0.5rem 0',
  },
  ctaPrimary: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '1rem 1.5rem',
    fontSize: '1.1rem',
    fontWeight: '800',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    border: '2px solid transparent',
  },
  ctaSecondary: { // Usado para "Quero garantir minha vaga" no Hero
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '1.1rem 1.5rem',
    fontSize: '1.2rem',
    fontWeight: '800',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    border: `2px solid ${colors.secondary}`,
  },
  ctaHero: {
    marginBottom: '1rem',
    // Hover/Active (precisa de JS ou CSS real para melhor efeito)
    // ':hover': { transform: 'scale(1.02)' }
  },

  // --- Seções Comuns ---
  section: {
    padding: '2.5rem 0',
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    position: 'relative',
  },
  
  // --- Listas de Diferenciais/Conteúdo ---
  list: {
    listStyle: 'none',
    padding: '0',
    maxWidth: '450px',
    margin: '0 auto',
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    fontSize: '1rem',
    fontWeight: '500',
    lineHeight: '1.4',
  },
  listIcon: {
    color: colors.secondary,
    marginRight: '0.75rem',
    flexShrink: 0,
    marginTop: '3px',
  },
  listText: {
    color: colors.text,
  },

  // --- Seção Instrutoras ---
  instructorsSection: {
    backgroundColor: colors.lightGray,
  },
  instructorsIntro: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1rem',
    color: colors.text,
    maxWidth: '450px',
    margin: '0 auto 2rem',
  },
  instructorsGrid: {
    display: 'flex',
    flexDirection: 'column', // Mobile: stacked
    gap: '2rem',
    alignItems: 'center',
  },
  instructorCard: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: colors.white,
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '300px',
  },
  instructorImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '1rem',
    border: `3px solid ${colors.secondary}`,
  },
  instructorName: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '0.25rem',
  },
  instructorCro: {
    fontSize: '0.9rem',
    color: colors.text,
    opacity: 0.7,
  },
  
  // --- Seção Depoimentos ---
  testimonialsGrid: {
    display: 'grid',
    gap: '1.5rem',
  },
  testimonialCard: {
    backgroundColor: colors.white,
    padding: '1.5rem',
    borderRadius: '10px',
    borderLeft: `5px solid ${colors.secondary}`,
    fontSize: '1rem',
    fontStyle: 'italic',
    color: colors.text,
    lineHeight: '1.5',
    position: 'relative',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  quoteIcon: {
    fontSize: '3rem',
    color: colors.secondary,
    position: 'absolute',
    top: '-0.5rem',
    left: '0.5rem',
    opacity: 0.3,
    lineHeight: 1,
  },

  // --- Seção Local/Agenda ---
  agendaText: {
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: '1.5rem',
  },
  mapPlaceholder: {
    backgroundColor: colors.lightGray,
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    border: `1px solid ${colors.primary}`,
    textAlign: 'center',
    padding: '1rem',
  },
  mapLink: {
    marginTop: '0.75rem',
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
    borderBottom: `1px solid ${colors.primary}`,
  },

  // --- Seção FAQ ---
  faqList: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  faqItem: {
    marginBottom: '1rem',
    border: `1px solid ${colors.primary}`,
    borderRadius: '8px',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  faqQuestion: {
    display: 'block',
    padding: '1rem',
    fontWeight: '700',
    color: colors.primary,
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  faqAnswer: {
    padding: '0 1rem 1rem 1rem',
    fontSize: '0.95rem',
    color: colors.text,
  },

  // --- CTA Final ---
  finalCtaSection: {
    backgroundColor: colors.primary,
    color: colors.white,
    textAlign: 'center',
  },
  finalCtaText: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    maxWidth: '450px',
    margin: '0 auto 2rem',
  },
  ctaFinal: {
    maxWidth: '300px',
    margin: '0 auto 1rem',
    padding: '1.2rem 1.5rem',
    fontSize: '1.25rem',
  },
  priceDisclaimerSmall: {
    fontSize: '0.85rem',
    opacity: 0.8,
    marginTop: '1rem',
  },

  // --- Footer ---
  footer: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '1.5rem 0',
    marginTop: 'auto', // Fixa no final do conteúdo
    fontSize: '0.8rem',
    textAlign: 'center',
  },
  footerText: {
    marginBottom: '1rem',
    opacity: 0.8,
  },
  footerLink: {
    color: colors.secondary,
    textDecoration: 'none',
    borderBottom: `1px solid ${colors.secondary}`,
    display: 'block',
    marginBottom: '0.5rem',
  },
  copyright: {
    marginTop: '1rem',
    opacity: 0.6,
  },

  // --- Botão Flutuante ---
  floatingCta: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    backgroundColor: '#25D366', // Cor do WhatsApp
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
    zIndex: 1001,
    padding: 0,
    textIndent: '-9999px', // Esconde o texto, mantendo o aria-label
    fontSize: '0', // Garante que o texto não apareça
  },
  whatsappIcon: {
    width: '30px',
    height: '30px',
    color: colors.white,
    textIndent: '0',
    display: 'block',
  },
  
  // --- Media Query para Desktop/Tablet (Exemplo Básico) ---
  // Nota: Estilos inline JS não suportam media queries simples. 
  // Para regras complexas como esta, é melhor usar a tag <style> ou CSS real.
  // Mantendo o foco no MOBILE FIRST, este código prioriza a visualização 9:16/mobile.
};

// Injeta um <style> real para regras responsivas essenciais.
// A performance é garantida por ser CSS crítico inline.
document.addEventListener('DOMContentLoaded', () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    /* Responsividade para Desktop/Tablet (quebra em 600px) */
    @media (min-width: 600px) {
        /* Header */
        header a[role="button"] {
            padding: 0.6rem 1.25rem !important;
            font-size: 0.95rem !important;
        }

        /* Hero Section */
        #hero {
            min-height: 80vh;
            padding-bottom: 4rem !important;
        }
        #hero .hero-content {
            max-width: 500px;
        }
        #hero h1 {
            font-size: 2.5rem !important;
        }
        #hero p:first-of-type {
            font-size: 1.2rem !important;
        }
        
        /* Layout de Seções */
        section {
            padding: 4rem 0 !important;
        }
        h2 {
            font-size: 2rem !important;
        }
        
        /* Instrutoras em Grid */
        #instrutoras .instructors-grid {
            flex-direction: row !important;
            justify-content: center;
        }
        
        /* Depoimentos em Grid */
        #depoimentos .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        
        /* CTA Final */
        #final-cta .cta-button {
            max-width: 400px;
        }
        
        /* Botão Flutuante maior e mais discreto */
        .floating-cta {
            width: 65px !important;
            height: 65px !important;
            bottom: 30px !important;
            right: 30px !important;
        }
    }
  `;
  document.head.appendChild(styleEl);
});

export default App;