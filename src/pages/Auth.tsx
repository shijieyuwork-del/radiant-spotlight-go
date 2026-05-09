import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { useCn } from "@/lib/cn-i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Auth = () => {
  const { lang } = useCn();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  const t = (en: string, zh: string) => (lang === "zh" ? PLACEHOLDER_SWAP : en SWAP_ENDzh);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success(t("Check your inbox to confirm your email.", "请到邮箱完成验证。"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("Welcome back!", "欢迎回来！"));
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? t("Google sign-in failed.", "Google 登录失败。"));
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-mint grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="grid place-items-center size-10 rounded-2xl bg-background shadow-soft">
            <Sparkles className="size-5 text-primary" />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight">
            glowy<span className="text-primary">·care</span>
          </span>
        </Link>

        <div className="rounded-3xl bg-card shadow-pop p-6 md:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-center tracking-tight">
            {tab === "signin" ? t("Welcome back", "欢迎回来") : t("Create your account", "创建账户")}
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1.5">
            {tab === "signin"
              ? t("Sign in to manage quotes, bookings & saved doctors.", "登录后可管理咨询、预约与收藏。")
              : t("Join glowy in 30 seconds — totally free.", "30 秒注册 glowy，完全免费。")}
          </p>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogle}
            className="w-full mt-6 h-11 rounded-2xl gap-2 font-medium"
          >
            <GoogleIcon />
            {t("Continue with Google", "使用 Google 继续")}
          </Button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              {t("or", "或")}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full rounded-2xl">
              <TabsTrigger value="signin" className="rounded-xl">
                {t("Sign in", "登录")}
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl">
                {t("Sign up", "注册")}
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleEmail} className="space-y-4 mt-5">
              <TabsContent value="signup" className="m-0">
                <Field label={t("Display name", "昵称")} icon={null}>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("Jane", "小美")}
                    className="rounded-xl h-11"
                  />
                </Field>
              </TabsContent>

              <Field label="Email" icon={<Mail className="size-4 text-muted-foreground" />}>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="rounded-xl h-11 pl-9"
                />
              </Field>

              <Field
                label={t("Password", "密码")}
                icon={<Lock className="size-4 text-muted-foreground" />}
              >
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl h-11 pl-9"
                />
              </Field>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-semibold"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    {tab === "signin" ? t("Sign in", "登录") : t("Create account", "注册")}
                    <ArrowRight className="ml-1.5 size-4" />
                  </>
                )}
              </Button>
            </form>
          </Tabs>

          <p className="text-[11px] text-muted-foreground text-center mt-6">
            {t("By continuing you agree to our Terms & Privacy.", "继续即表示同意服务条款与隐私政策。")}
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-2xl bg-background shadow-soft hover:shadow-pop text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5"
          >
            <ArrowRight className="size-4 rotate-180" />
            {t("Back to home", "返回首页")}
          </Link>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-foreground/80">{label}</Label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
      {children}
    </div>
  </div>
);

const GoogleIcon = () => (
  <svg className="size-4" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.5 29.4 4.5 24 4.5 13 4.5 4.5 13 4.5 24S13 43.5 24 43.5c10.8 0 19.5-8.7 19.5-19.5 0-1.2-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 7 29.4 5 24 5 16.3 5 9.6 9.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 43.5c5.3 0 10.1-2 13.7-5.3l-6.3-5.3c-2 1.5-4.6 2.4-7.4 2.4-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 38.9 16.2 43.5 24 43.5z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4-3.9 5.4l6.3 5.3c-.4.4 6.8-5 6.8-14.7 0-1.2-.1-2.3-.4-3.5z" />
  </svg>
);

export default Auth;
