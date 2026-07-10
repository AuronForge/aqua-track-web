import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AvatarComponent } from '../../../../shared/ui/avatar/avatar.component';
import { AvatarVariant } from '../../../../shared/ui/avatar/avatar-variant.type';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { DatepickerFormfieldComponent } from '../../../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';
import { SettingsCardComponent } from '../../../../shared/components/settings-card/settings-card.component';
import { LANGUAGE_LOCALE_MAP } from '../../../../shared/constants/language-locale.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { ProfileInformationFormValue } from '../../models/profile-information-form-value.model';
import { ProfileUser } from '../../models/profile-user.model';

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-profile-information-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AvatarComponent,
    ButtonComponent,
    DatepickerFormfieldComponent,
    SettingsCardComponent,
  ],
  templateUrl: './profile-information-card.component.html',
  styleUrl: './profile-information-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInformationCardComponent {
  private readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.translation;
  protected readonly locale = computed(
    () => LANGUAGE_LOCALE_MAP[this.languageService.selectedLanguage()],
  );

  readonly user = input.required<ProfileUser>();
  readonly saving = input<boolean>(false);
  readonly saveSuccess = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly avatarPreviewUrl = input<string | null>(null);
  readonly avatarUploading = input<boolean>(false);
  readonly avatarUploadError = input<boolean>(false);

  readonly saveProfile = output<ProfileInformationFormValue>();
  readonly avatarFileSelected = output<File>();

  private readonly avatarInput = viewChild.required<ElementRef<HTMLInputElement>>('avatarInput');

  protected readonly avatarError = signal<string | null>(null);

  readonly form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(20), Validators.pattern(/^[0-9()+\-\s]*$/)],
    }),
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const user = this.user();
      this.form.patchValue(
        {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone ?? '',
          birthDate: user.birthDate ?? '',
        },
        { emitEvent: false },
      );
      this.form.markAsPristine();
    });

    effect(() => {
      if (this.saveSuccess()) {
        this.form.markAsPristine();
      }
    });
  }

  protected triggerAvatarPicker(): void {
    this.avatarInput().nativeElement.click();
  }

  protected onAvatarFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';

    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      this.avatarError.set(this.t().profileAvatarInvalidType);
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      this.avatarError.set(this.t().profileAvatarTooLarge);
      return;
    }

    this.avatarError.set(null);
    this.avatarFileSelected.emit(file);
  }

  protected readonly avatarSrc = computed(
    () => this.avatarPreviewUrl() ?? this.user().avatarUrl ?? '',
  );

  protected readonly avatarVariant = computed<AvatarVariant>(() =>
    this.avatarSrc() ? 'circular' : 'initials',
  );

  protected readonly formattedMemberSince = computed(() => {
    const memberSince = this.user().memberSince;
    const date = new Date(memberSince);

    if (Number.isNaN(date.getTime())) {
      return memberSince;
    }

    return new Intl.DateTimeFormat(this.locale(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  });

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.saveProfile.emit(this.form.getRawValue());
  }
}
