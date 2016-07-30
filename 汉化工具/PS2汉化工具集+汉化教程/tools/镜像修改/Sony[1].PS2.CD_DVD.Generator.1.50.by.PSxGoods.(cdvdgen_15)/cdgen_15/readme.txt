[SCEA CONFIDENTIAL DOCUMENT]
PlayStation 2 CD/DVD-Rom Generator 1.5
        Copyright (C) 2002 by Sony Computer Entertainment America Inc.
                                                   All Rights Reserved
                                                             Jul. 2002
======================================================================


This release of CD/DVD-ROM Generator 1.50 contains partial support for
the Pioneer A03/A04 drives (same as OEM models DVR103/DVR104). The
support is partial in the sense that these drives, although capable of
CDR as well as DVDR burning, can only produce DVDR's with this software
(Note that it is still possible to create usable test CDR's with these
burners using cdvd2iso and other third party software--check the
CD/DVD-Rom Generator Project on the website for details). Also, since
these drives utilize the "For Data", aka "General" type DVDR, they
cannot be used to create submission discs. The reason for this is that
our factories require pre-master discs be on the DVDR for Authoring
media.  This last condition will eventually be removed, but the
schedule has yet to be determined.

Despite these limitations, this release can still be very useful.
These drives are less expensive and easier to obtain than the
"For Authoring" Pioneer DVR-S201. They are IDE drives, so a SCSI card
is no longer a requirement.  The general use media is also cheaper.
For internal use, testing, etc. the combination of this software and
one of these drives is a much more economical solution. Additionally,
this combination allows 2X speed DVD burning, saving a considerable
amount of time if the disc is near full capacity.

Support for Dual Layer (DVD9) projects is also greatly improved when
compared to version 1.40 (which was not put into general release by
SCEA). The implementation of layers is much more intuitive, and the
images for each layer are easier to maintain.


Suggested candidates for this upgrade:

1. Anyone with a Pioneer A03/A04 drive.
2. Anyone using or experimenting with DVD9.