import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Youtube, Users, User, Heart, DollarSign, Banknote, Smartphone,
  Building, Copy, Check, Upload, Image, Trash2, X, ArrowLeft,
  CircleCheck, PartyPopper, Gift, History, LogOut, ExternalLink,
  Sparkles, ShieldCheck, Wallet, CreditCard, Star, Trophy,
} from "lucide-react";
import { toast } from "sonner";

/* ── Constants ── */
const VALID_CODES = [
  "1024A", "3582B", "4719C", "6931D", "2845E", "5163F", "7208G", "9452H",
  "1376J", "8604K", "2197L", "6385M", "4921N", "5740P", "3062R", "8159S",
  "2634T", "9817U", "1548V", "7296W", "4035X", "6182Y", "5374Z", "8920A",
  "1463B", "7058C", "2914D", "6537E", "4825F", "9170G",
];

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

const BANK_DETAILS: Record<string, { label: string; icon: React.ReactNode; details: { label: string; value: string }[] }> = {
  telebirr: {
    label: "Telebirr",
    icon: <Smartphone className="w-5 h-5" />,
    details: [
      { label: "Send to", value: "0912345678" },
      { label: "Name", value: "Lewi Assefa" },
    ],
  },
  cbe: {
    label: "CBE",
    icon: <Building className="w-5 h-5" />,
    details: [
      { label: "Account", value: "1000348271635" },
      { label: "Name", value: "Lewi Assefa" },
    ],
  },
  dashen: {
    label: "Dashen Bank",
    icon: <Landmark className="w-5 h-5" />,
    details: [
      { label: "Account", value: "5012398457221" },
      { label: "Name", value: "Lewi Assefa" },
    ],
  },
};

/* ── Helpers ── */
function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`)).catch(() => toast.error("Failed to copy"));
}

/* ── Types ── */
type PortalStep = "channel" | "payment" | "receipt" | "verify" | "success";

interface MainPortalProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

/* ── Confetti Particles ── */
function ConfettiBurst() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: "50vw", y: "50vh", scale: 0 }}
          animate={{
            opacity: 0,
            x: `${20 + Math.random() * 60}vw`,
            y: `${10 + Math.random() * 60}vh`,
            scale: [0, 1.5, 0],
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 1.5 + Math.random() * 1.5, ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            background: ["#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#3b82f6", "#ec4899"][i % 6],
          }}
        />
      ))}
    </div>
  );
}

export default function MainPortal({ user, onLogout }: MainPortalProps) {
  const [step, setStep] = useState<PortalStep>("channel");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [history, setHistory] = useState<{ amount: number; date: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);

  const channelName = "@lewi_2";
  const channelSubs = "42.5K";

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onload = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onload = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setReceipt(null);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCodeChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setCode(upper);
    setCodeError(false);
  };

  const handleVerify = () => {
    if (!code) {
      toast.error("Please enter your verification code");
      return;
    }
    if (VALID_CODES.includes(code)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setHistory((prev) => [...prev, { amount: amount || 0, date: new Date().toLocaleDateString() }]);
      toast.success("Code verified! Super Thanks confirmed! 🎉");
      setStep("success");
    } else {
      setCodeError(true);
      toast.error("Invalid code. Please check and try again.");
    }
  };

  const resetFlow = () => {
    setStep("channel");
    setAmount(null);
    setCustomAmount("");
    setSelectedBank(null);
    setReceipt(null);
    setReceiptPreview(null);
    setCode("");
    setCodeError(false);
  };

  const displayAmount = amount || (customAmount ? parseInt(customAmount) : 0);

  return (
    <div className="relative min-h-[100dvh] bg-[oklch(0.12_0.01_260)] overflow-hidden">
      {showConfetti && <ConfettiBurst />}

      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/3 via-transparent to-rose-500/3 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-white/2">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">L</span>
            </div>
            <span className="text-white font-semibold">Lewi Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              {user.name}
            </div>
            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          {step === "channel" && (
            <ChannelView
              key="channel"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              channelName={channelName}
              channelSubs={channelSubs}
              history={history}
              onSuperThanks={() => setStep("payment")}
            />
          )}

          {step === "payment" && (
            <PaymentView
              key="payment"
              amount={amount}
              setAmount={setAmount}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
              onBack={() => { setStep("channel"); setSelectedBank(null); }}
              onNext={() => setStep("receipt")}
            />
          )}

          {step === "receipt" && (
            <ReceiptView
              key="receipt"
              receiptPreview={receiptPreview}
              onDrop={handleFileDrop}
              onSelect={handleFileSelect}
              onRemove={removeReceipt}
              fileInputRef={fileInputRef}
              onBack={() => setStep("payment")}
              onNext={() => setStep("verify")}
            />
          )}

          {step === "verify" && (
            <VerifyView
              key="verify"
              code={code}
              onCodeChange={handleCodeChange}
              codeError={codeError}
              onVerify={handleVerify}
              onBack={() => setStep("receipt")}
              amount={displayAmount}
            />
          )}

          {step === "success" && (
            <SuccessView
              key="success"
              amount={displayAmount}
              onDone={resetFlow}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ── Sub-Views ── */

function ChannelView({
  searchQuery, setSearchQuery, channelName, channelSubs, history, onSuperThanks,
}: {
  searchQuery: string; setSearchQuery: (v: string) => void;
  channelName: string; channelSubs: string; history: { amount: number; date: string }[];
  onSuperThanks: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search YouTube channels..."
          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
        />
      </div>

      {/* Channel Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        {/* Banner gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-rose-500/20 via-emerald-500/10 to-rose-500/20" />

        <div className="relative pt-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
              L
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{channelName}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <Users className="w-4 h-4" />
                <span>{channelSubs} subscribers</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.a
              href="https://youtube.com/@lewi_2?si=ynCcd3_0_cf4AWER"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all"
            >
              <Youtube className="w-5 h-5" />
              View Channel
              <ExternalLink className="w-4 h-4" />
            </motion.a>
            <motion.button
              onClick={onSuperThanks}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all"
            >
              <Heart className="w-5 h-5" />
              Super Thanks
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Support History</h3>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">{h.date}</span>
                </div>
                <span className="text-emerald-400 font-semibold">{h.amount} Br</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function PaymentView({
  amount, setAmount, customAmount, setCustomAmount,
  selectedBank, setSelectedBank, onBack, onNext,
}: {
  amount: number | null; setAmount: (v: number | null) => void;
  customAmount: string; setCustomAmount: (v: string) => void;
  selectedBank: string | null; setSelectedBank: (v: string | null) => void;
  onBack: () => void; onNext: () => void;
}) {
  const canProceed = (amount !== null || (customAmount && parseInt(customAmount) > 0)) && selectedBank !== null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Amount Selection */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Select Amount</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {PRESET_AMOUNTS.map((a) => (
            <motion.button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`py-3 rounded-xl font-semibold text-sm transition-all ${
                amount === a
                  ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {a} Br
            </motion.button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">Br</span>
          <input
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value.replace(/\D/g, "")); setAmount(null); }}
            placeholder="Custom amount"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Bank Selection */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Payment Method</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(BANK_DETAILS).map(([key, bank]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedBank(key)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                selectedBank === key
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedBank === key ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-gray-400"
              }`}>
                {bank.icon}
              </div>
              <span className="text-white font-medium flex-1 text-left">{bank.label}</span>
              {selectedBank === key && <CircleCheck className="w-5 h-5 text-emerald-500" />}
            </motion.button>
          ))}
        </div>

        {/* Bank Details */}
        {selectedBank && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            {BANK_DETAILS[selectedBank].details.map((d) => (
              <div key={d.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-gray-400 text-sm">{d.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">{d.value}</span>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(d.value, d.label); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-emerald-400 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!canProceed}
        whileHover={canProceed ? { scale: 1.01 } : {}}
        whileTap={canProceed ? { scale: 0.98 } : {}}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
      >
        Continue to Upload Receipt
      </motion.button>
    </motion.div>
  );
}

function ReceiptView({
  receiptPreview, onDrop, onSelect, onRemove, fileInputRef, onBack, onNext,
}: {
  receiptPreview: string | null; onDrop: (e: React.DragEvent) => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void; fileInputRef: React.RefObject<HTMLInputElement | null>;
  onBack: () => void; onNext: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Upload Payment Receipt</h3>
        </div>

        {/* Drop Zone */}
        {!receiptPreview ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-500/30 transition-all group"
          >
            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-emerald-400 transition-colors" />
            <p className="text-gray-400 text-sm">Drag & drop your receipt here</p>
            <p className="text-gray-600 text-xs mt-1">or tap to browse</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelect} className="hidden" />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-white/10">
            <img src={receiptPreview} alt="Receipt" className="w-full max-h-64 object-contain bg-black/20" />
            <motion.button
              onClick={onRemove}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 p-2 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-white transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {receiptPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <p className="text-sm text-gray-400 mb-4">
              After uploading, forward your receipt to{" "}
              <a
                href="https://t.me/Proshop5432"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                @Proshop5432 on Telegram
              </a>{" "}
              to receive your 5-character verification code.
            </p>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all"
            >
              I have a verification code
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function VerifyView({
  code, onCodeChange, codeError, onVerify, onBack, amount,
}: {
  code: string; onCodeChange: (v: string) => void;
  codeError: boolean; onVerify: () => void; onBack: () => void; amount: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Verify Payment</h3>
        </div>

        <p className="text-gray-400 text-sm mb-2">
          Enter the 5-character code you received from Telegram
        </p>
        <p className="text-emerald-400 text-xs mb-6">
          Amount: {amount} Br
        </p>

        {/* Code Input */}
        <div className="mb-6">
          <input
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="e.g. 1024A"
            maxLength={5}
            className={`w-full text-center text-2xl font-mono tracking-[0.5em] py-4 rounded-xl border-2 transition-all bg-white/5 text-white placeholder-gray-600 focus:outline-none ${
              codeError
                ? "border-rose-500/50 focus:border-rose-500"
                : "border-white/10 focus:border-emerald-500/50"
            }`}
          />
          {codeError && (
            <p className="text-rose-400 text-xs mt-2">Invalid code. Please try again.</p>
          )}
        </div>

        <motion.button
          onClick={onVerify}
          disabled={code.length !== 5}
          whileHover={code.length === 5 ? { scale: 1.01 } : {}}
          whileTap={code.length === 5 ? { scale: 0.98 } : {}}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <CircleCheck className="w-5 h-5" />
          Verify Code
        </motion.button>
      </div>
    </motion.div>
  );
}

function SuccessView({ amount, onDone }: { amount: number; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
      >
        <CircleCheck className="w-12 h-12 text-emerald-400" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-white mb-2"
      >
        Super Thanks Confirmed!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-emerald-400 text-lg font-semibold mb-2"
      >
        {amount} Br
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-gray-400 text-sm mb-8 text-center"
      >
        Thank you for supporting @lewi_2! Your contribution means the world.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3"
      >
        <motion.button
          onClick={onDone}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Support Again
        </motion.button>
        <motion.a
          href="https://youtube.com/@lewi_2?si=ynCcd3_0_cf4AWER"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          <Youtube className="w-5 h-5" />
          Visit Channel
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

/* Missing icon component for Landmark */
function Landmark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}