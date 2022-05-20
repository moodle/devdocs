---
title: Locales
sidebar_position: 3
tags:
  - Processes
  - Translation
  - Language
  - UTF-8
---

:::info Definition (from [Wikipedia](http://en.wikipedia.org/wiki/Locale))

Locale is a set of parameters that defines the user's language, country and any special variant preferences that the user wants to see in their user interface. Usually a locale identifier consists of at least a language identifier and a region identifier.

:::

Actually, the one and only place where Moodle requires some locales to be installed on the machine is when handling date translation (according to information in [MDL-31622](https://tracker.moodle.org/browse/MDL-31622)).

Currently such locales are named differently under Unix-based and Win32-based platforms so we need to have them defined separately to allow Moodle to use them as necessary. For each **lang package** available for Moodle, we must specify the `locale` value (**Unix locale**) and the `localewin` value (**Win32 locale**). Both those strings should be (no mandatory) defined inside each Moodle 1.6 and upwards language pack to be able to display locale strings properly.

The general syntax for locales is:

```
    language[_country][.charset]
```

(with information under brackets being optional)

While the **.charset** part seems to work properly under Unix, it seems that is not working under Win32 (at least from PHP), and strings returned from some PHP functions aren't in the charset specified but in some sort of default charset. Let's call it `localewincharset`. This forces us to convert from this charset to the `current_charset()` being used by the user.

## Support in operating systems

:::warning

Just in case you freshly installed some new locales and they don't seem to work don't forget to restart your webserver.

:::

### openSUSE

SUSE linux 10.1 onwards contains all necessary locales in default installation

### Ubuntu based

The default installation contains only limited number of locales. You can generate all locales on server from command line:

```bash
    sudo apt install locales-all && sudo locale-gen
```

### Debian based

The default installation contains only a limited number of locales. You can generate the locales you need  on your server from the command line. Login as root and execute:

```bash
     dpkg-reconfigure locales
```

choose the ones you need and press OK, next select the default locale for your server and press OK.

### RHEL/CentOS

Since RHEL/CentOS 8 onwards you may need install additional language supports manually by `dnf/yum`:

```bash
     dnf install langpacks-<locale_code>
```

or, for saving disk space:

```bash
     dnf install glibc-langpack-<locale_code>
```

or, for all languages:

```bash
     dnf install glibc-all-langpacks
```

Then check that the locale appeared on the system:

```bash
     localectl list-locales
```

:::tip

More information about how using language packs can be found in the [Red Hat documentation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_using-langpacks_configuring-basic-system-settings).

:::

### MoodleBox

You can add locales by typing in the MoodleBox console:

```bash
     sudo dpkg-reconfigure locales
```

### FreeBSD

All 5.x and later versions should already contain a large number of supported locales with UTF-8 charset.

### MacOS

Mac OS support for many locales is very poor. There is no easy way to add new locales to a Mac OS.

You can find the installed locales by issuing the following command in a Mac:

```bash
     locale -a
```

Some people have attempted digital surgery to install a needed Mac locale, by copying an existing locale into a new file. You should really edit the newly copied file in order to make the changes needed from the source file in order to adapt to your real local settings (like currency). See [this site](https://stackoverflow.com/questions/9991603/add-a-locale-in-mac-osx) and [this one](https://lh.2xlibre.net/locales/) and [this one too](https://lh.2xlibre.net/locale/es_MX/glibc/).

### MS Windows

There is no way to add new locales, see following table for list of supported locales.

## Table of locales

<!-- cspell:ignore codepage -->
<!-- cspell:ignore codepages -->
<!-- cspell:ignore Gallego -->
<!-- cspell:ignore iscii -->
<!-- cspell:ignore localewin -->
<!-- cspell:ignore localewincharset -->
<!-- cspell:ignore Ngai -->
<!-- cspell:ignore Tahu -->
<!-- cspell:ignore wwow -->
<!-- cspell:ignore Waikoto -->

So, for each Moodle language pack, the following information will be described below these columns:

- **package_name:** name of the language pack as shown in http://download.moodle.org/lang16/.
- **lang_name:** name of the language as shown in http://download.moodle.org/lang16/.
- **locale:** locale string to be used under Unix platforms. This will be stored in each language **langconfig.php** file.
- **localewin:** locale string to be used under Win32 platforms. This will be stored in each language **langconfig.php** file.
- **localewincharset:** charset in which PHP is retrieving information from locale-dependent functions (strftime...). This will allow us to convert such strings to the final charset properly. This will be stored in each language **langconfig.php** file.

| package_name | lang_name | locale | localewin | localewincharset |
|---|---|---|---|---|
| af_utf8 | Afrikaans | af_ZA.UTF-8 | Afrikaans_South Africa.1252 | WINDOWS-1252 |
| sq_utf8 | Albanian | sq_AL.UTF-8 | Albanian_Albania.1250 | WINDOWS-1250 |
| ar_utf8 | Arabic | ar_SA.UTF-8 | Arabic_Saudi Arabia.1256 | WINDOWS-1256 |
| eu_utf8 | Basque | eu_ES.UTF-8 | Basque_Spain.1252 | WINDOWS-1252 |
| be_utf8 | Belarusian | be_BY.UTF-8 | Belarusian_Belarus.1251 | WINDOWS-1251 |
| bs_utf8 | Bosnian | bs_BA.UTF-8 | Bosnian (Latin) | WINDOWS-1250 |
| bg_utf8 | Bulgarian | bg_BG.UTF-8 | Bulgarian_Bulgaria.1251 | WINDOWS-1251 |
| ca_utf8 | Catalan | ca_ES.UTF-8 | Catalan_Spain.1252 | WINDOWS-1252 |
| hr_utf8 | Croatian | hr_HR.UTF-8 | Croatian_Croatia.1250 | WINDOWS-1250 |
| zh_cn_utf8 | Chinese (Simplified) | zh_CN.UTF-8 | Chinese_China.936 | CP936 |
| zh_tw_utf8 | Chinese (Traditional) | zh_TW.UTF-8 | Chinese_Taiwan.950 | CP950 |
| cs_utf8 | Czech | cs_CZ.UTF-8 | Czech_Czech Republic.1250 | WINDOWS-1250 |
| da_utf8 | Danish | da_DK.UTF-8 | Danish_Denmark.1252 | WINDOWS-1252 |
| nl_utf8 | Dutch | nl_NL.UTF-8 | Dutch_Netherlands.1252 | WINDOWS-1252 |
| en_utf8 | English | en.UTF-8 | English_Australia.1252 | -empty string- |
| en_us_utf8 | English (US) | -parent en_utf8 used- | -parent en_utf8 used- | -parent en_utf8 used- |
| et_utf8 | Estonian | et_EE.UTF-8 | Estonian_Estonia.1257 | WINDOWS-1257 |
| fa_utf8 | Farsi | fa_IR.UTF-8 | Farsi_Iran.1256 | WINDOWS-1256 |
| fil_utf8 | Filipino | fil_PH.UTF-8 | :warning: Filipino_Philippines.1252 | :warning: WINDOWS-1252 |
| fi_utf8 | Finnish | fi_FI.UTF-8 | Finnish_Finland.1252 | WINDOWS-1252 |
| fr_utf8 | French | fr_FR.UTF-8 or<br/>fr_CH.UTF-8 or<br/>fr_BE.UTF-8 | French_France.1252 | WINDOWS-1252 |
| fr_ca_utf8 | French (Canada) | fr_CA.UTF-8 | French_Canada.1252 | -parent fr_utf8 used- |
| ga_utf8 | Gaelic | ga.UTF-8 | :warning: Gaelic; Scottish Gaelic | WINDOWS-1252 |
| gl_utf8 | Gallego | gl_ES.UTF-8 | Galician_Spain.1252 | WINDOWS-1252 |
| ka_utf8 | Georgian | ka_GE.UTF-8 | :warning: Georgian_Georgia.65001 | -empty string- |
| de_utf8 | German | de_DE.UTF-8 | German_Germany.1252 | WINDOWS-1252 |
| de_du_utf8 | German (Personal) | de_DE.UTF-8 | -parent de_utf8 used- | -parent de_utf8 used- |
| el_utf8 | Greek | el_GR.UTF-8 | Greek_Greece.1253 | WINDOWS-1253 |
| gu_utf8 | Gujarati | gu.UTF-8 | Gujarati_India.0 |  |
| he_utf8 | Hebrew | he_IL.utf8 | Hebrew_Israel.1255 | WINDOWS-1255 |
| hi_utf8 | Hindi | hi_IN.UTF-8 | :warning: Hindi.65001 | -empty string- |
| hu_utf8 | Hungarian | hu.UTF-8 | Hungarian_Hungary.1250 | WINDOWS-1250 |
| is_utf8 | Icelandic | is_IS.UTF-8 | Icelandic_Iceland.1252 | WINDOWS-1252 |
| id_utf8 | Indonesian | id_ID.UTF-8 | Indonesian_indonesia.1252 | WINDOWS-1252 |
| it_utf8 | Italian | it_IT.UTF-8 | Italian_Italy.1252 | WINDOWS-1252 |
| ja_utf8 | Japanese | ja_JP.UTF-8 | Japanese_Japan.932 | CP932 |
| kn_utf8 | Kannada | kn_IN.UTF-8 | :warning: Kannada.65001 | -empty string- |
| km_utf8 | Khmer | km_KH.UTF-8 | :warning: Khmer.65001 | -empty string- |
| ko_utf8 | Korean | ko_KR.UTF-8 | Korean_Korea.949 | EUC-KR |
| lo_utf8 | Lao | lo_LA.UTF-8 | Lao_Laos.UTF-8 | WINDOWS-1257 |
| lt_utf8 | Lithuanian | lt_LT.UTF-8 | Lithuanian_Lithuania.1257 | WINDOWS-1257 |
| lv_utf8 | Latvian | lat.UTF-8 | Latvian_Latvia.1257 | WINDOWS-1257 |
| ml_utf8 | Malayalam | ml_IN.UTF-8 | :warning: Malayalam_India.x-iscii-ma | :warning: x-iscii-ma |
| ms_utf8 | Malaysian | ms_MY.UTF-8 | Malay_malaysia.1252 | WINDOWS-1252 |
| mi_tn_utf8 | Maori (Ngai Tahu) | mi_NZ.UTF-8 | :warning: Maori.1252 | :warning: WINDOWS-1252 |
| mi_wwow_utf8 | Maori (Waikoto Uni) | mi_NZ.UTF-8 | :warning: Maori.1252 | :warning: WINDOWS-1252 |
| mn_utf8 | Mongolian | mn.UTF-8 | Cyrillic_Mongolian.1251 |  |
| no_utf8 | Norwegian | no_NO.UTF-8 | Norwegian_Norway.1252 | WINDOWS-1252 |
| no_gr_utf8 | Norwegian (Primary) | no_NO.UTF-8 | -parent no_utf8 used- | -parent no_utf8 used- |
| nn_utf8 | Nynorsk | nn_NO.UTF-8 | Norwegian-Nynorsk_Norway.1252 | WINDOWS-1252 |
| pl_utf8 | Polish | pl.UTF-8 | Polish_Poland.1250 | WINDOWS-1250 |
| pt_utf8 | Portuguese | pt_PT.UTF-8 | Portuguese_Portugal.1252 | WINDOWS-1252 |
| pt_br_utf8 | Portuguese (Brazil) | pt_BR.UTF-8 | Portuguese_Brazil.1252 | WINDOWS-1252 |
| ro_utf8 | Romanian | ro_RO.UTF-8 | Romanian_Romania.1250 | WINDOWS-1250 |
| ru_utf8 | Russian | ru_RU.UTF-8 | Russian_Russia.1251 | WINDOWS-1251 |
| sm_utf8 | Samoan | mi_NZ.UTF-8 | Maori.1252 | WINDOWS-1252 |
| sr_utf8 | Serbian | sr_CS.UTF-8 | Bosnian(Cyrillic)<br/>:warning: Serbian (Cyrillic) | WINDOWS-1251 |
| sk_utf8 | Slovak | sk_SK.UTF-8 | Slovak_Slovakia.1250 | WINDOWS-1250 |
| sl_utf8 | Slovenian | sl_SI.UTF-8 | Slovenian_Slovenia.1250 | WINDOWS-1250 |
| so_utf8 | Somali | so_SO.UTF-8 | :warning: not found! | :warning: not found! |
| es_utf8 | Spanish (International) | es_ES.UTF-8 | Spanish_Spain.1252 | WINDOWS-1252 |
| sv_utf8 | Swedish | sv_SE.UTF-8 | Swedish_Sweden.1252 | WINDOWS-1252 |
| tl_utf8 | Tagalog | tl.UTF-8 | :warning: not found! | :warning: not found! |
| ta_utf8 | Tamil | ta_IN.UTF-8 | English_Australia.1252 |  |
| th_utf8 | Thai | th_TH.UTF-8 | Thai_Thailand.874 | WINDOWS-874 |
| to_utf8 | Tongan | mi_NZ.UTF-8' | Maori.1252 | WINDOWS-1252 |
| tr_utf8 | Turkish | tr_TR.UTF-8 | Turkish_Turkey.1254 | WINDOWS-1254 |
| uk_utf8 | Ukrainian | uk_UA.UTF-8 | Ukrainian_Ukraine.1251 | WINDOWS-1251 |
| vi_utf8 | Vietnamese | vi_VN.UTF-8 | Vietnamese_Viet Nam.1258 | WINDOWS-1258 |

:::note

Some locales for windows with :warning: (warning icon) could be incorrect (technically or geographically but they are the only way found to show dates properly in XP box). Also some other cells with must be revised because they are not working.

:::

## References

### Windows

- Win32 Language names: http://msdn.microsoft.com/en-us/library/dd318693.aspx
- Win32 Country names: http://msdn.microsoft.com/en-us/library/cdax410z.aspx
- Win32 codepage codes: http://www.microsoft.com/globaldev/reference/wincp.mspx
- Win32 NLS Reference: http://msdn.microsoft.com/es-es/goglobal/bb896001.aspx
- Languages and codepages: http://www.science.co.il/Language/Locale-Codes.asp
- More languages and codepages: http://code.cside.com/3rdpage/windows/
- Languages and locales: http://www.livio.net/main/charset.asp
- Table of language identifiers: http://msdn.microsoft.com/library/default.asp?url=/library/en-us/intl/nls_238z.asp

### Unix

- Unix Language names: http://www.loc.gov/standards/iso639-2/englangn.html (639-2 is used only if 639-1 doesn't exist, see the "Locale Name Guide" below).
- Unix Country names: https://www.iso.org/iso-3166-country-codes.html
- Declaring character encodings in HTML: https://www.w3.org/International/questions/qa-html-encoding-declarations
- More locales: http://search.cpan.org/~drolsky/DateTime-Locale-0.42/lib/DateTime/Locale/Catalog.pm

### Other Information

- Locale Name Guide: http://www.i18nguy.com/locales/locale-resources.html
- FAQ about ISO 639: http://www.loc.gov/standards/iso639-2/faq.html
- One initiative from Unicode: https://cldr.unicode.org/
- Weekdays and Months: http://www.domesticat.net/misc/monthsdays.php

## List of locales supported on Moodle community servers

Locales, used in language packs should come from this list only:

```
aa_DJ
aa_DJ.utf8
aa_ER
aa_ER@saaho
aa_ET
af_ZA
af_ZA.utf8
ak_GH
am_ET
an_ES
an_ES.utf8
anp_IN
ar_AE
ar_AE.utf8
ar_BH
ar_BH.utf8
ar_DZ
ar_DZ.utf8
ar_EG
ar_EG.utf8
ar_IN
ar_IQ
ar_IQ.utf8
ar_JO
ar_JO.utf8
ar_KW
ar_KW.utf8
ar_LB
ar_LB.utf8
ar_LY
ar_LY.utf8
ar_MA
ar_MA.utf8
ar_OM
ar_OM.utf8
ar_QA
ar_QA.utf8
ar_SA
ar_SA.utf8
ar_SD
ar_SD.utf8
ar_SS
ar_SY
ar_SY.utf8
ar_TN
ar_TN.utf8
ar_YE
ar_YE.utf8
as_IN
ast_ES
ast_ES.utf8
ayc_PE
az_AZ
be_BY
be_BY@latin
be_BY.utf8
bem_ZM
ber_DZ
ber_MA
bg_BG
bg_BG.utf8
bhb_IN.utf8
bho_IN
bn_BD
bn_IN
bo_CN
bo_IN
br_FR
br_FR@euro
br_FR.utf8
brx_IN
bs_BA
bs_BA.utf8
byn_ER
C
ca_AD
ca_AD.utf8
ca_ES
ca_ES@euro
ca_ES.utf8
ca_ES.utf8@valencia
ca_ES@valencia
ca_FR
ca_FR.utf8
ca_IT
ca_IT.utf8
ce_RU
ckb_IQ
cmn_TW
crh_UA
csb_PL
cs_CZ
cs_CZ.utf8
C.UTF-8
cv_RU
cy_GB
cy_GB.utf8
da_DK
da_DK.utf8
de_AT
de_AT@euro
de_AT.utf8
de_BE
de_BE@euro
de_BE.utf8
de_CH
de_CH.utf8
de_DE
de_DE@euro
de_DE.utf8
de_LI.utf8
de_LU
de_LU@euro
de_LU.utf8
doi_IN
dv_MV
dz_BT
el_CY
el_CY.utf8
el_GR
el_GR.utf8
en_AG
en_AU
en_AU.utf8
en_BW
en_BW.utf8
en_CA
en_CA.utf8
en_DK
en_DK.iso885915
en_DK.utf8
en_GB
en_GB.iso885915
en_GB.utf8
en_HK
en_HK.utf8
en_IE
en_IE@euro
en_IE.utf8
en_IN
en_NG
en_NZ
en_NZ.utf8
en_PH
en_PH.utf8
en_SG
en_SG.utf8
en_US
en_US.iso885915
en_US.utf8
en_ZA
en_ZA.utf8
en_ZM
en_ZW
en_ZW.utf8
eo
eo_US.utf8
eo.utf8
es_AR
es_AR.utf8
es_BO
es_BO.utf8
es_CL
es_CL.utf8
es_CO
es_CO.utf8
es_CR
es_CR.utf8
es_CU
es_DO
es_DO.utf8
es_EC
es_EC.utf8
es_ES
es_ES@euro
es_ES.utf8
es_GT
es_GT.utf8
es_HN
es_HN.utf8
es_MX
es_MX.utf8
es_NI
es_NI.utf8
es_PA
es_PA.utf8
es_PE
es_PE.utf8
es_PR
es_PR.utf8
es_PY
es_PY.utf8
es_SV
es_SV.utf8
es_US
es_US.utf8
es_UY
es_UY.utf8
es_VE
es_VE.utf8
et_EE
et_EE.iso885915
et_EE.utf8
eu_ES
eu_ES@euro
eu_ES.utf8
eu_FR
eu_FR@euro
eu_FR.utf8
fa_IR
ff_SN
fi_FI
fi_FI@euro
fi_FI.utf8
fil_PH
fo_FO
fo_FO.utf8
fr_BE
fr_BE@euro
fr_BE.utf8
fr_CA
fr_CA.utf8
fr_CH
fr_CH.utf8
fr_FR
fr_FR@euro
fr_FR.utf8
fr_LU
fr_LU@euro
fr_LU.utf8
fur_IT
fy_DE
fy_NL
ga_IE
ga_IE@euro
ga_IE.utf8
gd_GB
gd_GB.utf8
gez_ER
gez_ER@abegede
gez_ET
gez_ET@abegede
gl_ES
gl_ES@euro
gl_ES.utf8
gu_IN
gv_GB
gv_GB.utf8
hak_TW
ha_NG
he_IL
he_IL.utf8
hi_IN
hne_IN
hr_HR
hr_HR.utf8
hsb_DE
hsb_DE.utf8
ht_HT
hu_HU
hu_HU.utf8
hy_AM
hy_AM.armscii8
ia_FR
id_ID
id_ID.utf8
ig_NG
ik_CA
is_IS
is_IS.utf8
it_CH
it_CH.utf8
it_IT
it_IT@euro
it_IT.utf8
iu_CA
iw_IL
iw_IL.utf8
ja_JP.eucjp
ja_JP.utf8
ka_GE
ka_GE.utf8
kk_KZ
kk_KZ.utf8
kl_GL
kl_GL.utf8
km_KH
kn_IN
kok_IN
ko_KR.euckr
ko_KR.utf8
ks_IN
ks_IN@devanagari
ku_TR
ku_TR.utf8
kw_GB
kw_GB.utf8
ky_KG
lb_LU
lg_UG
lg_UG.utf8
li_BE
lij_IT
li_NL
ln_CD
lo_LA
lt_LT
lt_LT.utf8
lv_LV
lv_LV.utf8
lzh_TW
mag_IN
mai_IN
mg_MG
mg_MG.utf8
mhr_RU
mi_NZ
mi_NZ.utf8
mk_MK
mk_MK.utf8
ml_IN
mni_IN
mn_MN
mr_IN
ms_MY
ms_MY.utf8
mt_MT
mt_MT.utf8
my_MM
nan_TW
nan_TW@latin
nb_NO
nb_NO.utf8
nds_DE
nds_NL
ne_NP
nhn_MX
niu_NU
niu_NZ
nl_AW
nl_BE
nl_BE@euro
nl_BE.utf8
nl_NL
nl_NL@euro
nl_NL.utf8
nn_NO
nn_NO.utf8
nr_ZA
nso_ZA
oc_FR
oc_FR.utf8
om_ET
om_KE
om_KE.utf8
or_IN
os_RU
pa_IN
pap_AN
pap_AW
pap_CW
pa_PK
pl_PL
pl_PL.utf8
POSIX
ps_AF
pt_BR
pt_BR.utf8
pt_PT
pt_PT@euro
pt_PT.utf8
quz_PE
raj_IN
ro_RO
ro_RO.utf8
ru_RU
ru_RU.cp1251
ru_RU.koi8r
ru_RU.utf8
ru_UA
ru_UA.utf8
rw_RW
sa_IN
sat_IN
sc_IT
sd_IN
sd_IN@devanagari
sd_PK
se_NO
shs_CA
sid_ET
si_LK
sk_SK
sk_SK.utf8
sl_SI
sl_SI.utf8
so_DJ
so_DJ.utf8
so_ET
so_KE
so_KE.utf8
so_SO
so_SO.utf8
sq_AL
sq_AL.utf8
sq_MK
sr_ME
sr_RS
sr_RS@latin
ss_ZA
st_ZA
st_ZA.utf8
sv_FI
sv_FI@euro
sv_FI.utf8
sv_SE
sv_SE.iso885915
sv_SE.utf8
sw_KE
sw_TZ
szl_PL
ta_IN
ta_LK
tcy_IN.utf8
te_IN
tg_TJ
tg_TJ.utf8
the_NP
th_TH
th_TH.utf8
ti_ER
ti_ET
tig_ER
tk_TM
tl_PH
tl_PH.utf8
tn_ZA
tr_CY
tr_CY.utf8
tr_TR
tr_TR.utf8
ts_ZA
tt_RU
tt_RU@iqtelif
ug_CN
ug_CN@latin
uk_UA
uk_UA.utf8
unm_US
ur_IN
ur_PK
uz_UZ
uz_UZ@cyrillic
uz_UZ.utf8
ve_ZA
vi_VN
wa_BE
wa_BE@euro
wa_BE.utf8
wae_CH
wal_ET
wo_SN
xh_ZA
xh_ZA.utf8
yi_US
yi_US.utf8
yo_NG
yue_HK
zh_CN
zh_CN.gb18030
zh_CN.gbk
zh_CN.utf8
zh_HK
zh_HK.utf8
zh_SG
zh_SG.gbk
zh_SG.utf8
zh_TW
zh_TW.euctw
zh_TW.utf8
zu_ZA
zu_ZA.utf8
```

## See also

- [MDLSITE-5744](https://tracker.moodle.org/browse/MDLSITE-5744)
