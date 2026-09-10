import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight, MapPin } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { HospitalDirectoryPhoto } from "@/components/HospitalDirectoryPhoto";
import { ClinicExperts } from "@/components/clinics/ClinicExperts";
import { ClinicComparisonInfo } from "@/components/clinics/ClinicComparisonInfo";
import { useQuote } from "@/components/QuoteRequest";
import { CITIES } from "@/data/cities";
import { findClinicBySlug, getClinicPath } from "@/data/clinicDirectory";
import { findClinicPublicProfile } from "@/data/clinicProfiles";
import { clinicPhoto } from "@/lib/clinic-photo";
import { useClinicDirectory } from "@/hooks/use-clinic-directory";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { clinicPageMeta } from "@/lib/clinic-seo";

export default function ClinicDetail() {
  const { slug = "" } = useParams();
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es: T) => asiaCopy(lang, { en, zh, ru, es });
  const { clinics, doctors, isLoading, isError, refetch } = useClinicDirectory();
  const clinic = findClinicBySlug(slug, clinics);
  const city = CITIES.find((item) => item.slug === clinic?.citySlug);
  const { open } = useQuote();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!clinic || !city) {
    const title = isLoading
      ? c("Loading hospital details…", "正在加载医院详情…", "Загрузка сведений…", "Cargando detalles…")
      : isError
        ? c("Hospital details are temporarily unavailable", "医院详情暂时无法加载", "Сведения временно недоступны", "Detalles temporalmente no disponibles")
        : c("Hospital not found", "未找到这家医院", "Учреждение не найдено", "Centro no encontrado");
    return <div className="min-h-screen bg-background">
      <PageMeta title={title} description={title} path={getClinicPath(slug)} robots="noindex, follow" />
      <AsiaNavbar />
      <main className="container min-h-[55vh] py-16" aria-busy={isLoading}>
        <h1 className="font-display text-3xl font-medium" aria-live="polite">{title}</h1>
        {isLoading && <div className="mt-8 h-48 max-w-3xl rounded-2xl bg-muted motion-safe:animate-pulse" />}
        {isError && <Button className="mt-6 mr-4" onClick={() => void refetch()}>{c("Try again", "重试", "Повторить", "Reintentar")}</Button>}
        <Button asChild variant="outline" className="mt-6"><Link to="/clinics">{c("Back to all hospitals", "返回医院目录", "Все учреждения", "Volver al directorio")}</Link></Button>
      </main>
      <Footer />
    </div>;
  }

  const name = lang === "zh" ? clinic.nameZh : clinic.nameEn;
  const publicProfile = findClinicPublicProfile(clinic);
  const secondary = lang === "zh" ? clinic.nameEn : clinic.nameZh;
  const cityName = lang === "zh" ? city.zh : city.en;
  const area = lang === "zh" ? publicProfile?.campus?.areaZh ?? clinic.areaZh : publicProfile?.campus?.areaEn ?? clinic.areaEn;
  const photo = clinicPhoto(clinic);
  const description = (lang === "zh" ? clinic.descriptionZh : clinic.descriptionEn) ?? "";
  const related = clinics.filter((item) => item.citySlug === clinic.citySlug && item.slug !== clinic.slug).slice(0, 3);
  const experts = doctors.filter((doctor) => clinic.doctorIds.includes(doctor.id));
  const cityDirectory = `/clinics?city=${city.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <PageMeta {...clinicPageMeta(clinic)} />
      <AsiaNavbar />
      <main className="container max-w-7xl pb-16 pt-6 md:pt-10">
        <nav aria-label={c("Breadcrumb", "面包屑导航", "Навигационная цепочка", "Ruta de navegación")} className="text-xs text-muted-foreground sm:text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="rounded-sm hover:underline">{c("Home", "首页", "Главная", "Inicio")}</Link></li>
            <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
            <li><Link to="/clinics" className="rounded-sm hover:underline">{c("Clinics & hospitals", "医院与诊所", "Клиники и больницы", "Clínicas y hospitales")}</Link></li>
            <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
            <li aria-current="page" className="min-w-0 break-words text-foreground">{name}</li>
          </ol>
        </nav>

        <header className="my-8 max-w-5xl md:my-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c("Hospital & clinic directory", "医院与诊所目录", "Каталог клиник и больниц", "Directorio de clínicas y hospitales")}</p>
          <h1 className="mt-4 break-words font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">{name}</h1>
          {secondary && secondary !== name && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{secondary}</p>}
          <p className="mt-5 flex items-center gap-2 text-sm"><MapPin className="size-4 shrink-0" aria-hidden="true" /><Link to={cityDirectory} className="underline underline-offset-4">{cityName}</Link><span className="text-muted-foreground">· {c("China", "中国", "Китай", "China")}</span></p>
        </header>

        {publicProfile && <ClinicComparisonInfo profile={publicProfile} onAsk={() => open({ hospitalName: clinic.nameEn, city: city.en, source: "clinic_detail" })} />}

        <div className="grid items-start gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="min-w-0 space-y-8 lg:col-span-2">
            <figure className="overflow-hidden rounded-2xl border border-border/70">
              <HospitalDirectoryPhoto key={photo?.src ?? "no-photo"} photo={photo} name={name} priority className="aspect-[4/3] sm:aspect-[3/2]" />
            </figure>
            <section aria-labelledby="clinic-overview-title">
              <h2 id="clinic-overview-title" className="font-display text-2xl font-medium">{c("About this listing", "关于此机构资料", "Об этой странице", "Sobre esta ficha")}</h2>
              {description && <p className="mt-4 whitespace-pre-line text-base leading-7 text-foreground">{description}</p>}
              <p className="mt-4 text-base leading-7 text-muted-foreground">{c(
                `This page brings together the directory information, available photographs and published expert profiles for ${clinic.nameEn} in ${city.en}.`,
                `本页汇集${city.zh}${clinic.nameZh}的目录资料、现有实拍图片和已发布的关联专家资料。`,
                `На этой странице собраны сведения из каталога, доступные фотографии и опубликованные профили специалистов учреждения ${clinic.nameEn}, ${city.en}.`,
                `Esta página reúne los datos del directorio, las fotografías disponibles y los perfiles publicados de ${clinic.nameEn}, en ${city.en}.`,
              )}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{c("A directory listing is not an endorsement or confirmation of a partnership. Confirm current licensing, departments, services and appointment availability directly with the institution.", "目录收录不代表推荐或合作关系确认。请直接向机构核实当前执照、科室、服务及可预约时间。", "Запись в каталоге не означает рекомендацию или подтверждение партнёрства. Уточняйте лицензии, отделения, услуги и доступность приёма непосредственно в учреждении.", "La inclusión no implica recomendación ni confirmación de colaboración. Confirma las licencias, departamentos, servicios y disponibilidad directamente con el centro.")}</p>
            </section>
            <ClinicExperts doctors={experts} isLoading={isLoading} isError={isError} retry={() => void refetch()} />
          </div>

          <aside className="min-w-0 rounded-2xl border border-primary/20 bg-primary/5 p-6 lg:sticky lg:top-36" aria-labelledby="clinic-location-title">
            <h2 id="clinic-location-title" className="font-display text-xl font-medium">{c("Location", "所在位置", "Расположение", "Ubicación")}</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-muted-foreground">{c("Destination", "目的地", "Направление", "Destino")}</dt><dd className="mt-1 font-medium">{cityName}, {c("China", "中国", "Китай", "China")}</dd></div>
              {area && <div><dt className="text-muted-foreground">{c("Listed area", "目录记录区域", "Район в каталоге", "Zona indicada")}</dt><dd className="mt-1 font-medium">{area}</dd></div>}
              {clinic.nameZh && <div><dt className="text-muted-foreground">{c("Chinese name", "中文名称", "Название на китайском", "Nombre en chino")}</dt><dd className="mt-1 break-words leading-6">{clinic.nameZh}</dd></div>}
            </dl>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">{c("Confirm the exact campus and street address before travelling.", "出行前请确认具体院区及街道地址。", "Перед поездкой уточните корпус и точный адрес.", "Confirma la sede y la dirección exacta antes de viajar.")}</p>
            <Link to={`/cities/${city.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-medium underline underline-offset-4">{c(`Explore ${cityName}`, `查看${cityName}指南`, `О городе ${cityName}`, `Explorar ${cityName}`)}<ArrowRight className="size-4" aria-hidden="true" /></Link>
            <div className="mt-6 border-t border-primary/20 pt-6">
              <h3 className="font-medium">{c("Talk to CeladonChina", "联系 CeladonChina", "Связаться с CeladonChina", "Habla con CeladonChina")}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{c("Ask our team about this hospital and your travel plans.", "向我们的团队咨询此医院及出行安排。", "Задайте нашей команде вопросы об учреждении и поездке.", "Pregunta a nuestro equipo sobre este centro y tus planes de viaje.")}</p>
              <Button className="mt-5 h-auto min-h-12 w-full whitespace-normal rounded-full px-5 py-3 text-foreground" onClick={() => open({ hospitalName: clinic.nameEn, city: city.en, source: "clinic_detail" })}>{c("Ask about this hospital", "咨询这家医院", "Узнать об учреждении", "Consultar sobre este centro")}<ArrowRight className="ml-2 size-4 shrink-0" aria-hidden="true" /></Button>
            </div>
          </aside>
        </div>

        <section aria-labelledby="related-clinics-title" className="mt-14 border-t border-border/70 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="related-clinics-title" className="font-display text-2xl font-medium">{c(`More hospitals in ${cityName}`, `${cityName}的更多医院`, `Другие учреждения: ${cityName}`, `Más centros en ${cityName}`)}</h2>
            <Link to={cityDirectory} className="text-sm underline underline-offset-4">{c("View all", "查看全部", "Смотреть все", "Ver todos")}</Link>
          </div>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => <li key={item.slug}><Link to={getClinicPath(item)} className="group flex h-full items-start justify-between gap-3 rounded-xl border border-border/70 p-5 hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><span><h3 className="font-medium leading-6 group-hover:underline">{lang === "zh" ? item.nameZh : item.nameEn}</h3><p className="mt-2 text-sm text-muted-foreground">{lang === "zh" ? item.areaZh : item.areaEn}</p></span><ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" /></Link></li>)}
          </ul>
        </section>
        <Link to={cityDirectory} className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4"><ArrowLeft className="size-4" aria-hidden="true" />{c("Back to directory", "返回医院目录", "Назад к каталогу", "Volver al directorio")}</Link>
      </main>
      <Footer />
    </div>
  );
}
