export const btnBase =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";
export const btnPrimary = `${btnBase} bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20`;
export const btnSecondary = `${btnBase} bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700`;
export const btnDanger = `${btnBase} bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30`;
export const btnGhost = `${btnBase} bg-transparent hover:bg-slate-800 text-slate-300`;
export const btnAmber = `${btnBase} bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20`;
export const btnPink = `${btnBase} bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg shadow-pink-500/20`;
export const btnSm = `${btnBase} px-3 py-1.5 text-xs`;
export const btnLg = `${btnBase} px-6 py-3 text-base`;
export const inputBase =
  "w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors duration-200";
export const selectBase =
  "w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors duration-200 cursor-pointer";
export const labelBase = "block text-sm font-medium text-slate-300 mb-1.5";
export const cardBase =
  "bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden";
export const cardHover =
  "hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-300";
export const cardHeader = "px-5 py-4 border-b border-slate-800";
export const cardBody = "p-5";
export const cardCompact = `${cardBase} p-4`;
export const container = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
export const pageHeader = "mb-8";
export const pageTitle = "text-3xl font-bold text-slate-100 tracking-tight";
export const pageSubtitle = "text-slate-400 mt-1 text-sm";
export const sectionTitle = "text-xl font-semibold text-slate-200 mb-4";
export const gridCols2 = "grid grid-cols-1 md:grid-cols-2 gap-4";
export const gridCols3 = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
export const gridCols4 = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
export const flexBetween = "flex items-center justify-between";
export const flexCenter = "flex items-center justify-center";
export const flexCol = "flex flex-col";
export const gapSm = "gap-2";
export const gapMd = "gap-4";
export const gapLg = "gap-6";
export const textPrimary = "text-slate-100";
export const textSecondary = "text-slate-400";
export const textMuted = "text-slate-500";
export const textAccent = "text-cyan-500";
export const textAmber = "text-amber-500";
export const textPink = "text-pink-500";
export const textSuccess = "text-emerald-400";
export const textError = "text-red-400";
export const textWarning = "text-amber-400";
export const fontBold = "font-bold";
export const fontSemibold = "font-semibold";
export const textXs = "text-xs";
export const textSm = "text-sm";
export const textLg = "text-lg";
export const textXl = "text-xl";
export const badgeBase =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
export const badgeCyan = `${badgeBase} bg-cyan-500/20 text-cyan-400 border border-cyan-500/30`;
export const badgeAmber = `${badgeBase} bg-amber-500/20 text-amber-400 border border-amber-500/30`;
export const badgePink = `${badgeBase} bg-pink-500/20 text-pink-400 border border-pink-500/30`;
export const badgeEmerald = `${badgeBase} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`;
export const badgeRed = `${badgeBase} bg-red-500/20 text-red-400 border border-red-500/30`;
export const raridadeCores = {
  COMUM: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    border: "border-slate-500/40",
    badge: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
    gradiente: "from-slate-600/20 to-transparent",
  },
  INCOMUM: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    gradiente: "from-emerald-600/20 to-transparent",
  },
  RARA: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/40",
    badge: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    gradiente: "from-cyan-600/20 to-transparent",
  },
  EPICA: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/40",
    badge: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    gradiente: "from-purple-600/20 to-transparent",
  },
  LENDARIA: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/40",
    badge: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    gradiente: "from-amber-600/20 to-transparent",
  },
  UNICA: {
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    border: "border-pink-500/40",
    badge: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    gradiente: "from-pink-600/20 to-transparent",
  },
};
export const elementoCores = {
  FOGO: {
    text: "text-red-400",
    bg: "bg-red-500/20",
    badge: "bg-red-500/20 text-red-400 border border-red-500/30",
  },
  AGUA: {
    text: "text-blue-400",
    bg: "bg-blue-500/20",
    badge: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
  TERRA: {
    text: "text-amber-500",
    bg: "bg-amber-500/20",
    badge: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  },
  VENTO: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  },
  LUZ: {
    text: "text-yellow-300",
    bg: "bg-yellow-300/20",
    badge: "bg-yellow-300/20 text-yellow-300 border border-yellow-300/30",
  },
  TREVAS: {
    text: "text-purple-400",
    bg: "bg-purple-600/20",
    badge: "bg-purple-600/20 text-purple-400 border border-purple-600/30",
  },
};
export const navLink =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all duration-200";
export const navLinkActive =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/20";
export const skeleton = "bg-slate-800 rounded-lg animate-pulse";
export const skeletonText = `${skeleton} h-4 w-3/4`;
export const skeletonCard = `${skeleton} h-48 w-full`;
export const skeletonCircle = `${skeleton} rounded-full`;
export const statCard = `${cardBase} p-4 text-center`;
export const statValue = "text-2xl font-bold text-cyan-400";
export const statLabel = "text-xs text-slate-500 mt-1 uppercase tracking-wider";
export const progressTrack =
  "w-full h-2 bg-slate-800 rounded-full overflow-hidden";
export const progressBar =
  "h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500";
export const progressBarAmber =
  "h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500";
export const toastBase =
  "flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm min-w-[300px]";
export const toastSucesso = `${toastBase} bg-emerald-500/10 border-emerald-500/30 text-emerald-300`;
export const toastErro = `${toastBase} bg-red-500/10 border-red-500/30 text-red-300`;
export const toastInfo = `${toastBase} bg-cyan-500/10 border-cyan-500/30 text-cyan-300`;
export const emptyState =
  "flex flex-col items-center justify-center py-16 text-center";
export const emptyStateIcon = "text-5xl mb-4 opacity-50";
export const emptyStateTitle = "text-lg font-semibold text-slate-300";
export const emptyStateDesc = "text-sm text-slate-500 mt-1";
