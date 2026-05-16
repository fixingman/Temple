// Icon abstraction — all app icons live here.
// Pages import from this file, never directly from @phosphor-icons/react.
// Default: bold weight, 20px. Override via size/weight props.

import {
  BookOpen, Stack, PlayCircle, ChartBar, Gear,
  Plus, Trash, PencilSimple, X, Check,
  Timer, Trophy, Barbell, YoutubeLogo,
  Warning, Sparkle, CloudArrowUp, Fire,
  ArrowLeft, ArrowRight, MagnifyingGlass,
  DotsThreeVertical, CaretRight, CaretDown, CaretUp,
  CheckCircle, XCircle, Info, Repeat,
  SlidersHorizontal, DownloadSimple, SignOut,
  Play, Pause,
} from "@phosphor-icons/react";

const ic = (Icon, defaultSize = 20, defaultWeight = "bold") =>
  ({ size, weight, ...props }) =>
    <Icon size={size ?? defaultSize} weight={weight ?? defaultWeight} {...props} />;

// Navigation
export const IcLibrary   = ic(BookOpen,          22);
export const IcSets      = ic(Stack,             22);
export const IcTrain     = ic(PlayCircle,        22);
export const IcProgress  = ic(ChartBar,          22);
export const IcSettings  = ic(Gear,              22);

// Actions
export const IcPlus      = ic(Plus);
export const IcTrash     = ic(Trash);
export const IcEdit      = ic(PencilSimple);
export const IcClose     = ic(X);
export const IcCheck     = ic(Check);
export const IcBack      = ic(ArrowLeft);
export const IcForward   = ic(ArrowRight);
export const IcSearch    = ic(MagnifyingGlass);
export const IcMore      = ic(DotsThreeVertical);
export const IcCaretRight= ic(CaretRight,        16);
export const IcCaretDown = ic(CaretDown,         16);
export const IcCaretUp   = ic(CaretUp,           16);
export const IcPlay      = ic(Play);
export const IcPause     = ic(Pause);
export const IcRepeat    = ic(Repeat);
export const IcDownload  = ic(DownloadSimple);
export const IcSignOut   = ic(SignOut);
export const IcSliders   = ic(SlidersHorizontal);

// Domain
export const IcTimer     = ic(Timer);
export const IcTrophy    = ic(Trophy);
export const IcBarbell   = ic(Barbell);
export const IcVideo     = ic(YoutubeLogo);
export const IcFire      = ic(Fire);
export const IcCloud     = ic(CloudArrowUp);
export const IcSparkle   = ic(Sparkle);

// Status
export const IcWarning   = ic(Warning);
export const IcOk        = ic(CheckCircle);
export const IcError     = ic(XCircle);
export const IcInfo      = ic(Info);
